import { Link } from "react-router-dom";
import logoBridge from "@/assets/logo-bridge.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img src={logoBridge} alt="MedBridge" className="h-8 w-8" />
              <span className="text-lg font-bold">MedBridge</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Where future physicians get their start.
            </p>
          </div>

          {/* For Students */}
          <div>
            <h4 className="font-semibold mb-4">For Students</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/opportunities" className="hover:text-secondary transition-colors">Browse Opportunities</Link></li>
              <li><Link to="/signup" className="hover:text-secondary transition-colors">Create Profile</Link></li>
              <li><Link to="/training" className="hover:text-secondary transition-colors">Training & Badges</Link></li>
              <li><Link to="/resources" className="hover:text-secondary transition-colors">Pre-Med Resources</Link></li>
            </ul>
          </div>

          {/* For Labs */}
          <div>
            <h4 className="font-semibold mb-4">For Labs & PIs</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/for-labs" className="hover:text-secondary transition-colors">Post Opportunities</Link></li>
              <li><Link to="/pricing" className="hover:text-secondary transition-colors">Pricing</Link></li>
              <li><Link to="/how-it-works" className="hover:text-secondary transition-colors">How It Works</Link></li>
              <li><Link to="/success-stories" className="hover:text-secondary transition-colors">Success Stories</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/about" className="hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-secondary transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-secondary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/80">
          <p>&copy; 2025 MedBridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
