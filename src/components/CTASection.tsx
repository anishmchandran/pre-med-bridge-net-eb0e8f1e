import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Futuristic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-accent/80 to-primary-light/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Floating badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm animate-fade-in">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Start Your Journey Today</span>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-6 tracking-tight leading-tight">
            Ready to Transform
            <span className="block mt-2">Your Medical Career?</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Join thousands of future physicians building their path to medicine through verified opportunities and meaningful connections.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="xl" 
              variant="outline"
              asChild
              className="bg-white text-primary hover:bg-white/90 border-0 shadow-premium-xl group"
            >
              <Link to="/auth" className="gap-3">
                Get Started Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              size="xl" 
              variant="outline" 
              asChild
              className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:border-white/50"
            >
              <Link to="/for-labs">For Research Labs</Link>
            </Button>
          </div>

          {/* Stats bar */}
          <div className="mt-16 pt-16 border-t border-white/20 grid grid-cols-3 gap-8">
            <div>
              <p className="text-4xl font-bold text-white mb-1">100%</p>
              <p className="text-sm text-white/70">Free for Students</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-1">&lt;5 min</p>
              <p className="text-sm text-white/70">Setup Time</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-1">24/7</p>
              <p className="text-sm text-white/70">Support Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent-light/10 rounded-full blur-3xl" />
    </section>
  );
};

export default CTASection;
