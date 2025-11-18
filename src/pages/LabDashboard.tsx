import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Users, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  Search,
  MessageSquare,
  Bell,
  LogOut,
  Settings,
  FileText
} from "lucide-react";
import logoWordmark from "@/assets/logo-wordmark.png";

const LabDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [labProfile, setLabProfile] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    
    setUser(session.user);
    await Promise.all([
      fetchLabProfile(session.user.id),
      fetchOpportunities(session.user.id),
      fetchApplications(session.user.id)
    ]);
    setLoading(false);
  };

  const fetchLabProfile = async (userId: string) => {
    const { data } = await supabase
      .from("lab_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    
    setLabProfile(data);
  };

  const fetchOpportunities = async (userId: string) => {
    const { data: labData } = await supabase
      .from("lab_profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (labData) {
      const { data } = await supabase
        .from("opportunities")
        .select("*")
        .eq("lab_profile_id", labData.id)
        .order("created_at", { ascending: false });
      
      setOpportunities(data || []);
    }
  };

  const fetchApplications = async (userId: string) => {
    const { data: labData } = await supabase
      .from("lab_profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (labData) {
      const { data: oppsData } = await supabase
        .from("opportunities")
        .select("id")
        .eq("lab_profile_id", labData.id);

      if (oppsData && oppsData.length > 0) {
        const oppIds = oppsData.map(o => o.id);
        const { data } = await supabase
          .from("applications")
          .select("*, profiles(*), opportunities(*)")
          .in("opportunity_id", oppIds)
          .order("created_at", { ascending: false });
        
        setApplications(data || []);
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!labProfile) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="bg-card border-b border-border sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <img src={logoWordmark} alt="MedBridge" className="h-8" />
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold mb-4">Create Your Lab Profile</h1>
          <p className="text-muted-foreground mb-8">
            Before posting opportunities, you need to create a lab profile. 
            This will be verified within 24 hours.
          </p>
          <Button size="lg" onClick={() => navigate("/lab-profile/create")}>
            Create Lab Profile
          </Button>
        </div>
      </div>
    );
  }

  const pendingApplications = applications.filter(a => a.status === "pending");
  const activeOpportunities = opportunities.filter(o => o.status === "active");
  const verifiedApplicants = applications.filter(a => a.profiles?.verified);

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
              <Button variant="ghost" size="icon" onClick={() => navigate("/lab-profile/settings")}>
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{labProfile.lab_name}</h1>
            <p className="text-muted-foreground">{labProfile.institution}</p>
          </div>
          <Button size="lg" onClick={() => navigate("/post-opportunity")}>
            <Plus className="mr-2 h-5 w-5" />
            Post New Opportunity
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Roles</p>
                  <p className="text-3xl font-bold">{activeOpportunities.length}</p>
                </div>
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending Applicants</p>
                  <p className="text-3xl font-bold">{pendingApplications.length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Applications</p>
                  <p className="text-3xl font-bold">{applications.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Verified Students</p>
                  <p className="text-3xl font-bold">{verifiedApplicants.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="opportunities" className="space-y-6">
          <TabsList>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="applicants">Applicants</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="space-y-4">
            {opportunities.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No opportunities yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first opportunity to start receiving applications
                  </p>
                  <Button onClick={() => navigate("/post-opportunity")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Post Opportunity
                  </Button>
                </CardContent>
              </Card>
            ) : (
              opportunities.map((opp) => (
                <Card key={opp.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{opp.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{opp.location}</p>
                      </div>
                      <Badge variant={opp.status === "active" ? "default" : "secondary"}>
                        {opp.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {opp.description}
                    </p>
                    <div className="flex gap-2 mb-4">
                      {opp.is_paid && <Badge variant="outline">Paid</Badge>}
                      <Badge variant="outline">{opp.category}</Badge>
                      <Badge variant="outline">{opp.hours_per_week}h/week</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/opportunities/${opp.id}`)}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/applicants/${opp.id}`)}
                      >
                        View Applicants
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="applicants">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No applications yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {applications.slice(0, 10).map((app) => (
                      <div 
                        key={app.id} 
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{app.profiles?.full_name || "Unknown"}</p>
                          <p className="text-sm text-muted-foreground">
                            Applied for: {app.opportunities?.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(app.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {app.profiles?.verified && (
                            <Badge variant="outline" className="bg-green-50">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <Badge variant="secondary">{app.status}</Badge>
                          <Button 
                            size="sm" 
                            onClick={() => navigate(`/applicant/${app.id}`)}
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Messaging Coming Soon</h3>
                <p className="text-muted-foreground">
                  Direct messaging with applicants will be available soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LabDashboard;
