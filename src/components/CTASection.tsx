import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary-light">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Start Your Medical Journey?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join MedBridge today and connect with opportunities that will shape your future in medicine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              asChild
              className="bg-secondary hover:bg-secondary-dark text-secondary-foreground text-lg"
            >
              <Link to="/auth">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild
              className="bg-background/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-background/20"
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
