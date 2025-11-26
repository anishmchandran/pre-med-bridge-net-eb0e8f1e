import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Filter } from "lucide-react";
import { CertificationDialog } from "@/components/profile/CertificationDialog";
import { CertificationProgress } from "@/components/certifications/CertificationProgress";
import { CertificationBadgeGrid } from "@/components/certifications/CertificationBadgeGrid";
import { CertificationTable } from "@/components/certifications/CertificationTable";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Certifications() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      fetchCertifications(user.id);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchCertifications(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchCertifications = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load certifications",
        variant: "destructive",
      });
    } else {
      setCertifications(data || []);
    }
    setLoading(false);
  };

  const handleCertificationAdded = () => {
    if (user) {
      fetchCertifications(user.id);
    }
  };

  const getFilteredCertifications = () => {
    if (filterStatus === "all") return certifications;
    
    const now = new Date();
    
    switch (filterStatus) {
      case "verified":
        return certifications.filter(cert => cert.verified);
      case "pending":
        return certifications.filter(cert => !cert.verified);
      case "expired":
        return certifications.filter(cert => {
          if (!cert.expiration_date) return false;
          return new Date(cert.expiration_date) < now;
        });
      default:
        return certifications;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const filteredCertifications = getFilteredCertifications();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Training Certifications</h1>
            <p className="text-muted-foreground">
              Complete these to become eligible for lab and clinical opportunities
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        </div>

        <CertificationProgress certifications={certifications} />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Your Badges</h2>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <CertificationBadgeGrid certifications={filteredCertifications} />

        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">All Certifications</h3>
          <CertificationTable 
            certifications={filteredCertifications} 
            onRefresh={() => user && fetchCertifications(user.id)}
          />
        </Card>
      </div>

      <CertificationDialog
        profileId={user?.id || ""}
        certification={null}
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onUpdate={handleCertificationAdded}
      />
    </div>
  );
}
