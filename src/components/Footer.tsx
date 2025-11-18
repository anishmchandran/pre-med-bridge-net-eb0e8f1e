import { Link } from "react-router-dom";
import logoBridge from "@/assets/logo-bridge.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-16 border-t border-primary-light/20">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2.5 mb-4 group">
              <img src={logoBridge} alt="MedBridge" className="h-9 w-9 transition-transform group-hover:scale-105" />
              <span className="text-lg font-semibold">MedBridge</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Where future physicians get their start.
            </p>
          </div>

          {/* For Students */}
          <div>
            <h4 className="font-semibold mb-5 text-base">For Students</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link to="/opportunities" className="hover:text-accent-light transition-colors">Browse Opportunities</Link></li>
              <li><Link to="/signup" className="hover:text-accent-light transition-colors">Create Profile</Link></li>
              <li><Link to="/training" className="hover:text-accent-light transition-colors">Training & Badges</Link></li>
              <li><Link to="/resources" className="hover:text-accent-light transition-colors">Pre-Med Resources</Link></li>
            </ul>
          </div>

          {/* For Labs */}
          <div>
            <h4 className="font-semibold mb-5 text-base">For Labs & PIs</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link to="/for-labs" className="hover:text-accent-light transition-colors">Post Opportunities</Link></li>
              <li><Link to="/pricing" className="hover:text-accent-light transition-colors">Pricing</Link></li>
              <li><Link to="/how-it-works" className="hover:text-accent-light transition-colors">How It Works</Link></li>
              <li><Link to="/success-stories" className="hover:text-accent-light transition-colors">Success Stories</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-5 text-base">Company</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link to="/about" className="hover:text-accent-light transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-accent-light transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-accent-light transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-accent-light transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-white/60">
          <p>&copy; 2025 MedBridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
