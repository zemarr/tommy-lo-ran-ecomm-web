import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/product-details";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/server/actions/product.actions";
import { Suspense } from "react";
import Header from "@/components/shared/header/header";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// export async function generateStaticParams() {
//   const slugs = getAllProductSlugs();
//   return slugs.map((slug) => ({ slug }));
// }

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Tómmy ló ràn",
    };
  }

  return {
    title: `${product.name} | Tómmy ló ràn`,
    description: product.longDescription.slice(0, 160),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        <Suspense fallback={<div className="w-screen h-screen absolute top-0 left-0 bg-black/20 transition-all"></div>}>
          <ProductDetails product={{
            ...product,
            updatedAt: product.updatedAt?.toString() ?? ""

          }} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
