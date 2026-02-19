import { create } from 'zustand';
import { CartItem, Product } from '@/types';
import { addToCart, clearCart, getMyCart, removeFromCart } from '../server/actions/cart.actions';
import { getProductById } from '../server/actions/product.actions';

// Timer map for debounced sync (per product)
const syncTimers = new Map<string, NodeJS.Timeout>();

interface CartStore {
  isCartOpen: boolean;
  items: CartItem[];
  pendingProductId: string | null;
  productStock: Record<string, number>;
  initializeCart: () => Promise<void>;
  getProductStock: (productId: string) => Promise<number>;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isCartOpen: false,
  pendingProductId: null,
  productStock: {},

  initializeCart: async () => {
    try {
      const cart = await getMyCart();

      set({ items: cart?.items ?? [] });
    } catch (error) {
      // set({ error: 'Failed to load cart', loading: false });
    }
  },

  setCartOpen: (open: boolean) => set({ isCartOpen: open }),

  // Fetch stock from server (can be cached)
  getProductStock: async (productId: string) => {
    const product = await getProductById(productId);
    return product?.stock ?? 0;
  },

  addItem: async (product: Product, quantity = 1) => {
    const { items, getProductStock } = get();
    const previousItems = items ? [...items] : []; // snapshot

    set({ pendingProductId: product.id });

    // 1. Check current stock
    const stock = await getProductStock(product.id);
    const existingItem = items?.find(i => i.productId === product.id);
    const currentQty = existingItem?.quantity ?? 0;
    const newQty = currentQty + quantity;

    if (newQty > stock) {
      // Not enough stock – abort
      // toast.error(`Only ${stock} available`);
      set({ pendingProductId: null });
      return;
    }

    // 2. Optimistic update
    let updatedItems: CartItem[] = [];
    if (items && existingItem) {
      updatedItems = items.map(item =>
        item.productId === product.id
          ? { ...item, quantity: newQty }
          : item
      );
    } else if (items) {
      const newItem: CartItem = {
        product,
        quantity,
        productId: product.id,
      };
      updatedItems = [...items, newItem];
    }

    set({ items: updatedItems, pendingProductId: null });

    // 3. Schedule server sync
    scheduleCartUpdateSyncToServer(product.id, previousItems);
  },

  removeItem: (productId: string) => {
    set(state => ({
      items: state.items.filter(item => item.productId !== productId),
    }));
    scheduleCartUpdateSyncToServer(productId);
  },

  updateQuantity: (productId: string, quantity: number) => {
    const { items, removeItem } = get();

    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    // Optimistic update
    const updatedItems = items?.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    set({ items: updatedItems });

    // Schedule server sync
    scheduleCartUpdateSyncToServer(productId);
  },

  clearCart: async () => {
    // Cancel all pending timers
    for (const [id, timer] of syncTimers) {
      clearTimeout(timer);
      syncTimers.delete(id);
    }
    set({ items: [] });
    // Optionally call server clearCart action here
    await clearCart();
  },

  getTotalPrice: () => {
    return get().items?.reduce(
      (total, item) => total + Number(item.product.price) * item.quantity,
      0
    );
  },

  getTotalItems: () => {
    return get().items?.reduce((total, item) => total + item.quantity, 0);
  },
}));

// ---------- Server sync helpers ----------

/**
 * Schedule a sync for a specific product after a short debounce.
 * Cancels any pending sync for the same product.
 */
async function scheduleCartUpdateSyncToServer(productId: string, previousItems?: CartItem[]) {
  const store = useCartStore.getState();
  // Clear existing timer
  if (syncTimers.has(productId)) {
    clearTimeout(syncTimers.get(productId)!);
    syncTimers.delete(productId);
  }

  const timeout = setTimeout(async () => {
    try {
      const { items } = useCartStore.getState();
      const latestItem = items?.find(i => i.productId === productId);

      let result;

      if (latestItem) {
        result = await addToCart(latestItem.productId, latestItem.quantity);
      } else {
        result = await removeFromCart(productId);
      }

      if (!result.success) {
        console.error("Sync failed:", result.message);

        // 🔥 Rollback
        useCartStore.setState({ items: previousItems });
      }
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      syncTimers.delete(productId);
    }
  }, 2000);

  syncTimers.set(productId, timeout);
}

/**
 * Fetch the latest cart from server and reset client state.
 */
async function refreshCartFromServer() {
  const result = await getMyCart();
  if (result) {
    useCartStore.setState({ items: result?.items }); // result.cart.items is already CartItem[]
  } else {
    useCartStore.setState({ items: [] }); // fallback to empty array
  }
}