import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import ProductShowcase from "@/components/product-showcase"
import TestimonialsSection from "@/components/testimonials-section"
import PromoBanner from "@/components/promo-banner"
import NewsSection from "@/components/news-section"
// import AboutSection from "@/components/about-section"
import CollectionSection from "@/components/collection-section"
import Footer from "@/components/footer"
import ProductHighlight from "@/components/product-highlight"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <ProductShowcase />
      <CollectionSection />
      <TestimonialsSection />
      <PromoBanner />
      <ProductHighlight />
      <NewsSection />
      {/* <AboutSection /> */}
      <Footer />
    </div>
  )
}
