import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-hover to-primary-light" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(24,166,166,0.15),transparent_50%)]" />
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-semibold text-white mb-6 tracking-tight leading-tight">
            Ready to Start Your
            <span className="block mt-2">Medical Journey?</span>
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join MedBridge today and connect with opportunities that will shape your future in medicine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="xl" 
              variant="accent"
              asChild
            >
              <Link to="/auth">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="xl" 
              variant="outline" 
              asChild
              className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:border-white/50"
            >
              <Link to="/for-labs">Post Opportunities</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
