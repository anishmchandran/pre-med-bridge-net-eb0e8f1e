import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navigation from "@/components/Navigation";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { AboutSection } from "@/components/profile/AboutSection";
import { EducationSection } from "@/components/profile/EducationSection";
import { CertificationsSection } from "@/components/profile/CertificationsSection";
import { SkillsSection } from "@/components/profile/SkillsSection";
import { ExperienceSection } from "@/components/profile/ExperienceSection";
import { ResearchInterestsSection } from "@/components/profile/ResearchInterestsSection";
import { AvailabilitySection } from "@/components/profile/AvailabilitySection";
import { DocumentsSection } from "@/components/profile/DocumentsSection";
import { ContactSection } from "@/components/profile/ContactSection";
import { PublicationsSection } from "@/components/profile/PublicationsSection";
import { AssociatedLabsSection } from "@/components/profile/AssociatedLabsSection";
import { OpenOpportunitiesSection } from "@/components/profile/OpenOpportunitiesSection";
import { Loader2, UserCircle } from "lucide-react";

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    checkUser();
  }, [userId]);

  const checkUser = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      navigate("/auth");
      return;
    }

    setUser(currentUser);
    
    // If no userId in params, show current user's profile
    const profileUserId = userId || currentUser.id;
    setIsOwnProfile(profileUserId === currentUser.id);
    
    await loadProfile(profileUserId);
  };

  const loadProfile = async (profileUserId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profileUserId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background bg-mesh flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
            <Loader2 className="h-12 w-12 animate-spin text-accent relative z-10" />
          </div>
          <p className="text-muted-foreground animate-pulse-soft">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 bg-mesh pointer-events-none" />
        <Navigation />
        <main className="container mx-auto px-4 py-16 max-w-7xl relative z-10">
          <div className="text-center floating-card max-w-md mx-auto py-16 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
              <UserCircle className="h-10 w-10 text-accent/50" />
            </div>
            <h1 className="text-2xl font-bold mb-3 text-foreground">Profile Not Found</h1>
            <p className="text-muted-foreground">Unable to load profile. Please try refreshing the page.</p>
          </div>
        </main>
      </div>
    );
  }

  const isPIProfile = profile?.title && profile?.department;

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh pointer-events-none" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="animate-fade-in">
              <ContactSection profile={profile} isOwnProfile={isOwnProfile} onUpdate={loadProfile} />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '50ms' }}>
              <ResearchInterestsSection 
                profileId={profile?.id} 
                interests={profile?.research_focus}
                isOwnProfile={isOwnProfile} 
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            <div className="animate-fade-in">
              <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} onUpdate={loadProfile} />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '50ms' }}>
              <AboutSection profile={profile} isOwnProfile={isOwnProfile} onUpdate={loadProfile} />
            </div>
            
            {/* PI-specific sections */}
            {isPIProfile && (
              <>
                <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                  <PublicationsSection profile={profile} />
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
                  <AssociatedLabsSection profileId={profile.id} />
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <OpenOpportunitiesSection profileId={profile.id} />
                </div>
              </>
            )}
            
            {/* General sections */}
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <EducationSection profileId={profile?.id} isOwnProfile={isOwnProfile} />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
              <CertificationsSection profileId={profile?.id} isOwnProfile={isOwnProfile} />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <SkillsSection profile={profile} isOwnProfile={isOwnProfile} onUpdate={loadProfile} />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '250ms' }}>
              <ExperienceSection profileId={profile?.id} isOwnProfile={isOwnProfile} />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <AvailabilitySection 
                profileId={profile?.id} 
                availability={profile?.weekly_availability}
                isOwnProfile={isOwnProfile} 
                onUpdate={loadProfile}
              />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '350ms' }}>
              <DocumentsSection profileId={profile?.id} isOwnProfile={isOwnProfile} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}