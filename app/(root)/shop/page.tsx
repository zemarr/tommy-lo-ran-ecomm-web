import { Footer } from "@/components/footer";
import ProductSearch from "@/components/shared/product-search";
import { Suspense } from "react";
import { getAllProducts } from "@/lib/server/actions/product.actions";
import { ShopClient } from "./components/shop-client-wrapper";
import Header from "@/components/shared/header/header";
import { ShopProductGrid } from "../../../components/shop-product-grid";

export default async function ShopPage(props: {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || '';
  const category = searchParams.category || '';

  const products = await getAllProducts({
    query: searchText,
    // limit: 2,
    page,
    category
  });

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-24 lg:pb-32">
        <div className="mx-auto max-w-10xl px-6 lg:px-16">


          {/* Page Header */}
          <div className="mb-16 lg:mb-20">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6">
              Shop
            </h1>
            <p className="text-muted-foreground leading-loose max-w-2xl">
              Shop our curated selection of contemporary African menswear.
              Each piece carries intentional storytelling, rooted in heritage and designed for today.
            </p>
          </div>

          {/* Search Bar */}
          <ProductSearch />
          {/* Main Content - Filters + Products */}
          <section className="lg:col-span-3">
            <Suspense fallback={<div className="w-screen h-screen absolute top-0 left-0 bg-black/20 transition-all"></div>}>
              <ShopProductGrid
                products={products.data}
                resultsCount={products.data.length}
              />
            </Suspense>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
