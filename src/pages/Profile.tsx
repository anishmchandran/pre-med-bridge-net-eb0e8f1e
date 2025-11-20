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
import { Loader2 } from "lucide-react";

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground">Unable to load profile. Please try refreshing the page.</p>
          </div>
        </main>
      </div>
    );
  }

  const isPIProfile = profile?.title && profile?.department;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <ContactSection profile={profile} isOwnProfile={isOwnProfile} />
            <ResearchInterestsSection 
              profileId={profile?.id} 
              interests={profile?.research_focus}
              isOwnProfile={isOwnProfile} 
            />
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} onUpdate={loadProfile} />
            <AboutSection profile={profile} isOwnProfile={isOwnProfile} onUpdate={loadProfile} />
            
            {/* PI-specific sections */}
            {isPIProfile && (
              <>
                <PublicationsSection profile={profile} />
                <AssociatedLabsSection profileId={profile.id} />
                <OpenOpportunitiesSection profileId={profile.id} />
              </>
            )}
            
            {/* General sections */}
            <EducationSection profileId={profile?.id} isOwnProfile={isOwnProfile} />
            <CertificationsSection profileId={profile?.id} isOwnProfile={isOwnProfile} />
            <SkillsSection profile={profile} isOwnProfile={isOwnProfile} onUpdate={loadProfile} />
            <ExperienceSection profileId={profile?.id} isOwnProfile={isOwnProfile} />
            <AvailabilitySection 
              profileId={profile?.id} 
              availability={profile?.weekly_availability}
              isOwnProfile={isOwnProfile} 
              onUpdate={loadProfile}
            />
            <DocumentsSection profileId={profile?.id} isOwnProfile={isOwnProfile} />
          </div>
        </div>
      </main>
    </div>
  );
}