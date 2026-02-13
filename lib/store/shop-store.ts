import { create } from 'zustand';
import { Product } from '@/types';

type SortBy = 'price-asc' | 'price-desc' | 'popular' | 'newest';

interface ShopStore {
  products: Product[];
  selectedCategory: string | null;
  priceRange: number[];
  searchQuery: string;
  sortBy: SortBy;
  expandedFilters: string[];

  // Setters / Actions
  setProducts: (products: Product[]) => void;
  onCategoryChange: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: SortBy) => void;
  toggleFilter: (filter: string) => void;
  handlePriceChange: (range: number[]) => void;
  resetFilters: () => void;

  // Derived state (getters)
  categories: () => string[];
  filteredProducts: () => Product[];
}

export const useShopStore = create<ShopStore>((set, get) => ({
  // ---------------- STATE ----------------
  products: [],
  selectedCategory: null,
  priceRange: [0, 500000],
  searchQuery: '',
  sortBy: 'newest',
  expandedFilters: [],

  // ---------------- ACTIONS ----------------
  setProducts: (products) => set({ products }),

  onCategoryChange: (category) => {
    set({ selectedCategory: category });
    // console.log('getCategoryOfProducts', get().filteredProducts());
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSortBy: (sort) => set({ sortBy: sort }),

  toggleFilter: (filter) =>
    set((state) => ({
      expandedFilters: state.expandedFilters.includes(filter)
        ? state.expandedFilters.filter((f) => f !== filter)
        : [...state.expandedFilters, filter],
    })),

  handlePriceChange: (range) =>
    set({
      priceRange: range,
    }),

  resetFilters: () =>
    set({
      selectedCategory: null,
      priceRange: [0, 500000],
      searchQuery: '',
      sortBy: 'newest',
      expandedFilters: [],
    }),

  // ---------------- DERIVED DATA ----------------
  categories: () => {
    const products = get().products;
    const cats = [...new Set(products.map((p) => p.category))];
    return cats.sort();
  },

  filteredProducts: () => {
    const {
      products,
      selectedCategory,
      priceRange,
      searchQuery,
      sortBy,
    } = get();

    let filtered = products.filter((product) => {
      // Category filter
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // Price range filter
      if (
        Number(product.price) < priceRange[0] ||
        Number(product.price) > priceRange[1]
      ) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.materials.some((m) =>
            m.toLowerCase().includes(query)
          )
        );
      }

      return true;
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-desc':
        sorted.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'popular':
        sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
        break;
    }

    return sorted;
  },
}));
