import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhySection from "@/components/WhySection";
import FeaturesGrid from "@/components/FeaturesGrid";
import PathwaySection from "@/components/PathwaySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <WhySection />
        <FeaturesGrid />
        <PathwaySection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
