import { create } from 'zustand';
import { CartItem, Product, ProductVariant } from '@/lib/types';
import { getMyCart, updateCart } from '../server/actions/cart.actions';
import { CartOperation } from '../types/cart.types';
import { convertToPlainObject, debounce } from '../utils';

// Timer map for debounced sync (per product)
const debouncedSyncMap = new Map<
  string,
  ReturnType<typeof debounce>
>();

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  pendingKeys: Set<string>; // track which items are being synced
  error: string | null;
  initializeCart: (items: CartItem[]) => void;
  addItem: (product: Product, quantity?: number, variant?: ProductVariant, color?: string) => Promise<void>;
  updateItemQuantity: (productId: string, quantity: number, variant?: ProductVariant, color?: string) => Promise<void>;
  removeItem: (productId: string, variant?: ProductVariant, color?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: (open?: boolean) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const getItemKey = (productId: string, variant?: ProductVariant, color?: string) =>
  `${ productId }_${ variant?.size ?? 'base' }_${ color ?? 'base' }`;

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isCartOpen: false,
  pendingKeys: new Set(),
  error: null,

  initializeCart: (items) => set({ items }),

  toggleCart: (open) => set((state) => ({ isCartOpen: open ?? !state.isCartOpen })),

  addItem: async (product, quantity = 1, variant, color) => {
    const key = getItemKey(product.id, variant, color);
    const { items, pendingKeys } = get();

    // Prevent duplicate operations
    if (pendingKeys.has(key)) return;

    // Determine new quantity
    const existingItem = items.find(
      i =>
        i.productId === product.id &&
        i.variant?.size === variant?.size &&
        i.color === color
    );
    const newQuantity = (existingItem?.quantity ?? 0) + quantity;

    // Client-side stock check (optimistic)
    const availableStock = variant?.stock ?? product.stock ?? 0;
    if (newQuantity > availableStock) {
      set({ error: `Only ${ availableStock } available` });
      return;
    }

    // Snapshot current items for rollback
    const previousItems = [ ...items ];

    // Optimistic update
    let updatedItems: CartItem[];
    if (existingItem) {
      updatedItems = items.map(item =>
        item.productId === product.id &&
          item.variant?.size === variant?.size &&
          item.color === color
          ? { ...item, quantity: newQuantity }
          : item
      );
    } else {
      const newItem: CartItem = {
        productId: product.id,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: variant?.price ?? product.price,
          images: product.images,
          stock: product.stock,
        },
        quantity,
        variant: variant ? { size: variant.size, price: variant.price, stock: variant.stock, productId: variant.productId } : undefined,
        color: color,
      };
      updatedItems = [ ...items, newItem ];
    }

    set({
      items: convertToPlainObject(updatedItems),
      pendingKeys: new Set(pendingKeys).add(key),
      error: null,
    });

    // Prepare operation for server
    const operation: CartOperation = {
      productId: product.id,
      quantity: newQuantity,
      variant: variant ? {
        size: variant.size,
        price: variant.price,
        stock: variant.stock,
      } : undefined,
      color: color,
    };

    // Call server
    const result = await updateCart(operation);

    if (!result.success) {
      // Rollback on failure
      set({
        items: previousItems,
        error: result.message,
      });
    }

    // Remove pending key
    set((state) => {
      const newPending = new Set(state.pendingKeys);
      newPending.delete(key);
      return { pendingKeys: newPending };
    });
  },


  updateItemQuantity: async (productId, quantity, variant, color) => {
    if (quantity <= 0) {
      return get().removeItem(productId, variant, color);
    }

    const key = getItemKey(productId, variant, color);
    const { items, pendingKeys } = get();

    const existingItem = items.find(
      i =>
        i.productId === productId &&
        i.variant?.size === variant?.size &&
        i.color === color
    );

    if (!existingItem) return;

    const previousItems = [ ...items ];

    // ✅ Optimistic UI update (instant)
    const updatedItems = items.map(item =>
      item.productId === productId &&
        item.variant?.size === variant?.size &&
        item.color === color
        ? { ...item, quantity }
        : item
    );

    set({
      items: convertToPlainObject(updatedItems),
    });

    // ✅ Create operation payload
    const operation: CartOperation = {
      productId,
      quantity,
      variant: variant
        ? {
          size: variant.size,
          price: variant.price,
          stock: variant.stock,
        }
        : undefined,
      color,
    };

    // ✅ Create debounced server sync if not existing
    if (!debouncedSyncMap.has(key)) {
      debouncedSyncMap.set(
        key,
        debounce(async (op: CartOperation, prevItems: CartItem[]) => {
          set(state => ({
            pendingKeys: new Set(state.pendingKeys).add(key),
          }));

          const result = await updateCart(op);

          if (!result.success) {
            set({
              items: prevItems,
              error: result.message,
            });
          }

          set(state => {
            const newPending = new Set(state.pendingKeys);
            newPending.delete(key);
            return { pendingKeys: newPending };
          });
        }, 2000)
      );
    }

    // ✅ Call debounced function
    debouncedSyncMap.get(key)!(operation, previousItems);
  },

  removeItem: async (productId, variant, color) => {
    const key = getItemKey(productId, variant, color);
    const { items, pendingKeys } = get();
    if (pendingKeys.has(key)) return;

    const previousItems = [ ...items ];

    // Optimistic remove
    const updatedItems = items.filter(
      item => !(item.productId === productId && item.variant?.size === variant?.size && item.color === color)
    );

    set({
      items: updatedItems,
      pendingKeys: new Set(pendingKeys).add(key),
    });

    const operation: CartOperation = {
      productId,
      quantity: 0, // signal removal
      variant: variant ? {
        size: variant.size,
        price: variant.price,
        stock: variant.stock,
      } : undefined,
      color,
    };

    const result = await updateCart(operation);

    if (!result.success) {
      set({ items: convertToPlainObject(previousItems), error: result.message });
    }

    set((state) => {
      const newPending = new Set(state.pendingKeys);
      newPending.delete(key);
      return { pendingKeys: newPending };
    });
  },

  clearCart: async () => {
    const previousItems = get().items;
    // Optimistic clear
    set({ items: [], pendingKeys: new Set(), error: null });
    
    try {
      // Rollback on failure
      set({ items: previousItems, error: "Failed to clear client cart" });
    } catch (error) {
      // Rollback on error
      set({ items: previousItems, error: 'Failed to clear client cart' });
    }
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => {
      const price = Number(item.variant?.price ?? item.product.price);
      return total + price * item.quantity;
    }, 0);
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

}));