import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Hours from "./pages/Hours";
import Certifications from "./pages/Certifications";
import HowItWorksPage from "./pages/HowItWorks";
import Opportunities from "./pages/Opportunities";
import OpportunityDetail from "./pages/OpportunityDetail";
import ForLabs from "./pages/ForLabs";
import LabDashboard from "./pages/LabDashboard";
import PostOpportunity from "./pages/PostOpportunity";
import CreateLabProfile from "./pages/CreateLabProfile";
import CreatePIProfile from "./pages/CreatePIProfile";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/hours" element={<Hours />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/training" element={<Certifications />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/about" element={<HowItWorksPage />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/opportunities/:id" element={<OpportunityDetail />} />
        <Route path="/for-labs" element={<ForLabs />} />
        <Route path="/lab-dashboard" element={<LabDashboard />} />
        <Route path="/post-opportunity" element={<PostOpportunity />} />
        <Route path="/lab-profile/create" element={<CreateLabProfile />} />
        <Route path="/pi-profile/create" element={<CreatePIProfile />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
