import ContactSection from "./ContactSection";
import Footer from "./Footer";
import GallerySection from "./GallerySection";
import HeroSection from "./HeroSection";
import Navbar from "./Navbar";
import ServicesSection from "./ServicesSection";
import TestimonialsSection from "./TestimonialsSection";

type Page = "home" | "about" | "admin";

interface HomePageProps {
  setPage?: (p: Page) => void;
}

export default function HomePage({ setPage }: HomePageProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar setPage={setPage} currentPage="home" />
      <main>
        <HeroSection onScrollTo={scrollTo} />
        <ServicesSection />
        <GallerySection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer setPage={setPage} />
    </div>
  );
}
