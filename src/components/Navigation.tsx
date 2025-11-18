import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logoBridge from "@/assets/logo-bridge.png";

const Navigation = () => {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logoBridge} alt="MedBridge" className="h-10 w-10" />
          <span className="text-xl font-bold text-primary">MedBridge</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/opportunities" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Find Opportunities
          </Link>
          <Link to="/for-labs" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            For Labs
          </Link>
          <Link to="/how-it-works" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            How It Works
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/auth">Log In</Link>
          </Button>
          <Button asChild className="bg-secondary hover:bg-secondary-dark text-secondary-foreground">
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
