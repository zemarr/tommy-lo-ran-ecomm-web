"use client";

import { useState, useMemo } from "react";
import { products, type Product } from "@/lib/products";
import { ShopSearch } from "@/components/shop-search";
import { ShopFilters } from "@/components/shop-filters";
import { ShopProductGrid } from "@/components/shop-product-grid";
import { CartSidebar } from "@/components/cart-sidebar";
import { useCartStore } from "@/lib/cart-store";
import { ShoppingBag } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return cats.sort();
  }, []);

  // Filter, search, and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Category filter
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // Price range filter
      if (
        product.priceValue < priceRange[0] ||
        product.priceValue > priceRange[1]
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

    // Apply sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case "popular":
        sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case "newest":
      default:
        sorted.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0)); // Remove the Number class if id is uuid format.
        break;
    }

    return sorted;
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  return (
    <>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <main className="min-h-screen pt-32 pb-24 lg:pb-32">
        <Header />
        <div className="mx-auto max-w-10xl px-6 lg:px-16">


          {/* Page Header */}
          <div className="mb-16 lg:mb-20">
            <p className="text-gold tracking-[0.4em] uppercase text-xs font-medium mb-4">
              The Collection
            </p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6">
              Shop All
            </h1>
            <p className="text-muted-foreground leading-loose max-w-2xl">
              Discover our curated selection of contemporary African menswear.
              Each piece carries intentional storytelling, rooted in heritage and designed for today.
            </p>
          </div>

          {/* Search Bar */}
          <ShopSearch onSearch={setSearchQuery} />

          {/* Main Content - Filters + Products */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1">
              <div className="sticky top-32">
                <h2 className="font-heading text-lg font-light text-foreground mb-8">
                  Refine
                </h2>
                <ShopFilters
                  categories={categories}
                  onCategoryChange={setSelectedCategory}
                  onPriceRangeChange={setPriceRange}
                  onSortChange={setSortBy}
                  selectedCategory={selectedCategory}
                  selectedSort={sortBy}
                />
              </div>
            </aside>

            {/* Products Grid */}
            <section className="lg:col-span-3">
              <ShopProductGrid
                products={filteredProducts}
                resultsCount={products.length}
              />
            </section>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
