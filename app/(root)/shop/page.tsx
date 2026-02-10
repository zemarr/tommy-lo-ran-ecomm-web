
import { ShopSearch } from "@/components/shop-search";
import { ShopFilters } from "@/components/shop-filters";
import { ShopProductGrid } from "@/components/shop-product-grid";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ProductSearch, { SearchSkeleton } from "@/components/shared/product-search";
import { Suspense } from "react";
import { getLatestProducts } from "@/lib/actions/product.actions";

export default async function ShopPage() {
  const latestProducts = await getLatestProducts();


  return (
    <>
      {/* <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> */}
      <Header />
      <main className="min-h-screen pt-32 pb-24 lg:pb-32">
        <div className="mx-auto max-w-10xl px-6 lg:px-16">


          {/* Page Header */}
          <div className="mb-16 lg:mb-20">
            <p className="text-gold tracking-[0.4em] uppercase text-xs font-medium mb-4">
              {/* The Collection */}
            </p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6">
              Shop
            </h1>
            <p className="text-muted-foreground leading-loose max-w-2xl">
              Shop our curated selection of contemporary African menswear.
              Each piece carries intentional storytelling, rooted in heritage and designed for today.
            </p>
          </div>

          {/* Search Bar */}
          <Suspense fallback={<SearchSkeleton />}>
            <ProductSearch />
            {/* <ShopSearch onSearch={setSearchQuery} /> */}
          </Suspense>

          {/* Main Content - Filters + Products */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1">
              <div className="sticky top-32">
                <h2 className="font-heading text-lg font-light text-foreground mb-8">
                  Refine
                </h2>
                <ShopFilters
                  products={latestProducts}
                // categories={categories}
                // onCategoryChange={setSelectedCategory}
                // onPriceRangeChange={setPriceRange}
                // onSortChange={setSortBy}
                // selectedCategory={selectedCategory}
                // selectedSort={sortBy}
                />
              </div>
            </aside>

            {/* Products Grid */}
            <section className="lg:col-span-3">
              <Suspense fallback={<div className="w-screen h-screen absolute top-0 left-0 bg-black/20 transition-all"></div>}>
                <ShopProductGrid
                  products={latestProducts}
                  resultsCount={latestProducts.length}
                />
              </Suspense>
            </section>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
