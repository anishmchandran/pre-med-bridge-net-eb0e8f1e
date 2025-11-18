import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logoBridge from "@/assets/logo-bridge.png";
import { useEffect, useState } from "react";

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-sm' 
        : 'backdrop-blur-md bg-background/60'
    }`}>
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <img 
            src={logoBridge} 
            alt="MedBridge" 
            className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" 
          />
          <span className="text-xl font-semibold bg-gradient-to-r from-primary via-accent to-primary-light bg-clip-text text-transparent">
            MedBridge
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-1">
          <Link 
            to="/opportunities" 
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg transition-all duration-200"
          >
            Find Opportunities
          </Link>
          <Link 
            to="/for-labs" 
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg transition-all duration-200"
          >
            For Labs
          </Link>
          <Link 
            to="/how-it-works" 
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg transition-all duration-200"
          >
            How It Works
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            asChild 
            size="default"
            className="hover:bg-accent/10"
          >
            <Link to="/auth">Log In</Link>
          </Button>
          <Button 
            variant="accent" 
            asChild 
            size="default"
            className="shadow-glow"
          >
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
