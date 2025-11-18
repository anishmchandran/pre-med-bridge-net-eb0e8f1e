import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Users, Award } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Medical research collaboration" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
            Where Future Physicians Get Their Start
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 animate-fade-in">
            Connect with research labs, clinical teams, and mentors — all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up">
            <Button 
              size="lg" 
              asChild
              className="bg-secondary hover:bg-secondary-dark text-secondary-foreground text-lg"
            >
              <Link to="/auth">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild
              className="bg-background/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-background/20"
            >
              <Link to="/for-labs">For Labs & PIs</Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-primary-foreground/20">
            <div className="text-center">
              <Search className="h-8 w-8 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary-foreground">500+</p>
              <p className="text-sm text-primary-foreground/80">Opportunities</p>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary-foreground">2,000+</p>
              <p className="text-sm text-primary-foreground/80">Students</p>
            </div>
            <div className="text-center">
              <Award className="h-8 w-8 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary-foreground">100+</p>
              <p className="text-sm text-primary-foreground/80">Partner Labs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
