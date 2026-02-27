import { create } from 'zustand'

interface ActionComponentStore {
  confirmDelete: boolean;
  deleting?: { id: string; items?: string[] };
  deletingProduct?: { id: string; name: string };
  setDeletingProduct: (id: string, name: string) => void;
  setDeleting: (id: string, items?: string[]) => void;
  setConfirmDelete: (val: boolean) => void;
}
export const useActionComponentStore = create<ActionComponentStore>((set) => ({
  confirmDelete: false,
  deleting: undefined,
  deletingProduct: undefined,
  setDeletingProduct: (id, name) => set((state) => ({ deletingProduct: state.deletingProduct = { id, name } })),
  setDeleting: (id, items) => set((state) => ({ deleting: state.deleting = { id, items } })),
  setConfirmDelete: (val) => {
    set((state) => ({ confirmDelete: state.confirmDelete = val }));
    // if (val) {
    //   setTimeout(() => {
    //     set((state) => ({ confirmDelete: state.confirmDelete = false }));
    //   }, 5000);
    // }
  }
}))
