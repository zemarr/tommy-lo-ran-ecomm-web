import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ProductsSection } from "@/components/products-section";
import { StorySection } from "@/components/story-section";
import { BespokeSection } from "@/components/bespoke-section";
// import { CraftsmanshipSection } from "@/components/craftsmanship-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <main className="">
      <Header />
      <HeroSection />
      <ProductsSection />
      <StorySection />
      <BespokeSection />
      {/* <CraftsmanshipSection /> */}
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
