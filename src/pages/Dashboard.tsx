import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, GraduationCap, MapPin, LogOut, Search, MessageSquare, Bell } from "lucide-react";
import logoWordmark from "@/assets/logo-wordmark.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      } else {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    setProfile(data);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const navigateToHours = () => {
    navigate("/hours");
  };

  const navigateToCertifications = () => {
    navigate("/certifications");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <img src={logoWordmark} alt="MedBridge" className="h-8" />
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Three Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Profile Card */}
          <aside className="lg:col-span-3">
            <Card>
              <CardHeader className="text-center pb-4">
                <Avatar className="h-20 w-20 mx-auto mb-3">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="text-lg">
                    {profile?.full_name ? getInitials(profile.full_name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">{profile?.full_name || "User"}</CardTitle>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile?.school && (
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.school}</span>
                  </div>
                )}
                {profile?.major && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.major}</span>
                  </div>
                )}
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/profile')}>
                  View Profile
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={navigateToHours}>
                  Hour Tracking
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={navigateToCertifications}>
                  Certifications
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  My Applications
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Saved Opportunities
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  My Network
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Center - Feed */}
          <main className="lg:col-span-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Research Assistant Position</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Department of Neuroscience • University Medical Center
                      </p>
                      <p className="text-sm mb-3">
                        Seeking undergraduate research assistant for cognitive neuroscience study...
                      </p>
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                          Paid
                        </span>
                        <span className="text-xs px-2 py-1 bg-accent rounded">
                          Part-time
                        </span>
                      </div>
                      <Button className="w-full mt-3">Apply Now</Button>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Suggested Labs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>L{i}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Smith Lab</p>
                      <p className="text-xs text-muted-foreground">
                        Cancer Biology
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Follow
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• 3 new opportunities match your profile</p>
                <p>• Dr. Johnson viewed your profile</p>
                <p>• Application deadline in 2 days</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;