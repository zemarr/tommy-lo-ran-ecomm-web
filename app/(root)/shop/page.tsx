
import { ShopSearch } from "@/components/shop-search";
import { ShopFilters } from "@/components/shop-filters";
import { ShopProductGrid } from "@/components/shop-product-grid";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ProductSearch, { SearchSkeleton } from "@/components/shared/product-search";
import { Suspense } from "react";
import { getAllProducts } from "@/lib/actions/product.actions";
import { ShopClient } from "./components/shop-client-wrapper";

export default async function ShopPage(props: {
  searchParams: Promise<{
    query: string;
    // page: string;
    // category: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const searchText = searchParams.query || '';
  const products = await getAllProducts({
    query: searchText,
  });

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
          <ShopClient products={products.data} />
        </div>
      </main>
      <Footer />
    </>
  );
}
