import { notFound } from "next/navigation";
import { getCollectionBySlug, getAllCollectionSlugs } from "@/lib/products";
// import { CollectionDetails } from "@/components/collection-details";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";
import { CollectionDetails } from "@/components/collection-details";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllCollectionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    return {
      title: "Collection Not Found | Tómmy ló ràn",
    };
  }

  return {
    title: `${collection.name} | Tómmy ló ràn`,
    description: collection.longDescription.slice(0, 160),
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  return (
    <>
      <main className="pt-20">
        <CollectionDetails collection={collection} />
      </main>
    </>
  );
}
