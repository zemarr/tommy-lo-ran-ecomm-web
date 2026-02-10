import { create } from 'zustand';
import { Product } from '../generated/prisma/client';


interface ProductStore {
  products: Product[];
  // removeItem: (productId: string) => void;
  // updateQuantity: (productId: string, quantity: number) => void;
  // clearProduct: () => void;
  // getTotalPrice: () => number;
  // getTotalItems: () => number;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],

  // removeItem: (productId: string) => {
  //   set((state) => ({
  //     items: state.items.filter(item => item.product.id !== productId),
  //   }));
  // },

  // updateQuantity: (productId, quantity) => {
  //   if (quantity <= 0) {
  //     get().removeItem(productId);
  //     return;
  //   }

  //   set((state) => ({
  //     items: state.items.map(item =>
  //       item.product.id === productId
  //         ? { ...item, quantity }
  //         : item
  //     ),
  //   }));
  // },

  // clearProduct: () => {
  //   set({ items: [] });
  // },

  // getTotalPrice: () => {
  //   const state = get();
  //   return state.items.reduce(
  //     (total, item) => total + Number(item.product.price) * item.quantity,
  //     0
  //   );
  // },

  // getTotalItems: () => {
  //   const state = get();
  //   return state.items.reduce((total, item) => total + item.quantity, 0);
  // },
}));
