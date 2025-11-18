import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Users, Award } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center">
      {/* Premium Background with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Medical research collaboration" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-hover to-primary/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-semibold text-white mb-6 animate-fade-in-slow tracking-tight">
            Where Future Physicians
            <span className="block mt-2 bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
              Get Their Start
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 animate-fade-in max-w-2xl mx-auto leading-relaxed">
            Connect with research labs, clinical teams, and mentors — all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
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
              <Link to="/for-labs">For Labs & PIs</Link>
            </Button>
          </div>

          {/* Premium Stats Grid */}
          <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/20 max-w-3xl mx-auto">
            <div className="group">
              <div className="mb-3 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/20 backdrop-blur-sm border border-accent/30 group-hover:bg-accent/30 transition-all">
                <Search className="h-7 w-7 text-accent-light" />
              </div>
              <p className="text-3xl font-semibold text-white mb-1">500+</p>
              <p className="text-sm text-white/70">Open Opportunities</p>
            </div>
            <div className="group">
              <div className="mb-3 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/20 backdrop-blur-sm border border-accent/30 group-hover:bg-accent/30 transition-all">
                <Users className="h-7 w-7 text-accent-light" />
              </div>
              <p className="text-3xl font-semibold text-white mb-1">2,000+</p>
              <p className="text-sm text-white/70">Active Students</p>
            </div>
            <div className="group">
              <div className="mb-3 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/20 backdrop-blur-sm border border-accent/30 group-hover:bg-accent/30 transition-all">
                <Award className="h-7 w-7 text-accent-light" />
              </div>
              <p className="text-3xl font-semibold text-white mb-1">100+</p>
              <p className="text-sm text-white/70">Partner Labs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
