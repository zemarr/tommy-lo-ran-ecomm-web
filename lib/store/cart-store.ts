import { create } from 'zustand';
import { Product } from '../generated/prisma/client';


export interface CartItem {
  product: Product;
  quantity: number;
  id: string;
}

interface CartStore {
  isCartOpen: boolean;
  items: CartItem[];
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
  setCartOpen: (open: boolean) => set({ isCartOpen: open }),

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find(item => item.product.id === product.id);

      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            product,
            quantity,
            id: `${product.id}-${Date.now()}`,
          },
        ],
      };
    });
  },

  removeItem: (productId: string) => {
    set((state) => ({
      items: state.items.filter(item => item.product.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    set((state) => ({
      items: state.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotalPrice: () => {
    const state = get();
    return state.items.reduce(
      (total, item) => total + Number(item.product.price) * item.quantity,
      0
    );
  },

  getTotalItems: () => {
    const state = get();
    return state.items.reduce((total, item) => total + item.quantity, 0);
  },
}));
