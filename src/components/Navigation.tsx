import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logoBridge from "@/assets/logo-bridge.png";

const Navigation = () => {
  return (
    <nav className="border-b border-border/50 glass-effect sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <img src={logoBridge} alt="MedBridge" className="h-10 w-10 transition-transform group-hover:scale-105" />
          <span className="text-xl font-semibold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            MedBridge
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-1">
          <Link 
            to="/opportunities" 
            className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
          >
            Find Opportunities
          </Link>
          <Link 
            to="/for-labs" 
            className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
          >
            For Labs
          </Link>
          <Link 
            to="/how-it-works" 
            className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
          >
            How It Works
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild size="default">
            <Link to="/auth">Log In</Link>
          </Button>
          <Button variant="accent" asChild size="default">
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
