import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Clock, DollarSign, Calendar, Users, Heart, Loader2 } from "lucide-react";
import ApplyModal from "@/components/opportunities/ApplyModal";
import { toast } from "sonner";

interface OpportunityDetail {
  id: string;
  title: string;
  description: string;
  responsibilities: string | null;
  category: string;
  required_certifications: string[];
  required_skills: string[];
  preferred_skills: string[];
  is_paid: boolean;
  compensation_amount: number | null;
  location: string;
  is_remote: boolean;
  hours_per_week: number | null;
  duration_months: number | null;
  start_date: string | null;
  slots_available: number;
  min_gpa: number | null;
  tags: string[];
  banner_url: string | null;
  lab_profiles: {
    lab_name: string;
    institution: string;
    department: string | null;
    description: string | null;
    contact_email: string | null;
  };
}

const OpportunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<OpportunityDetail | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadOpportunity();
      checkSavedStatus();
      checkApplicationStatus();
    }
  }, [id]);

  const loadOpportunity = async () => {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select(`
          *,
          lab_profiles (
            lab_name,
            institution,
            department,
            description,
            contact_email
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setOpportunity(data);
    } catch (error) {
      console.error("Error loading opportunity:", error);
      toast.error("Failed to load opportunity");
    } finally {
      setLoading(false);
    }
  };

  const checkSavedStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("saved_opportunities")
        .select("id")
        .eq("opportunity_id", id)
        .maybeSingle();

      if (error) throw error;
      setIsSaved(!!data);
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("id")
        .eq("opportunity_id", id)
        .maybeSingle();

      if (error) throw error;
      setHasApplied(!!data);
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  };

  const handleSaveToggle = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (isSaved) {
        const { error } = await supabase
          .from("saved_opportunities")
          .delete()
          .eq("opportunity_id", id)
          .eq("user_id", user.id);

        if (error) throw error;
        setIsSaved(false);
        toast.success("Removed from saved opportunities");
      } else {
        const { error } = await supabase
          .from("saved_opportunities")
          .insert([{ 
            opportunity_id: id,
            user_id: user.id
          }]);

        if (error) throw error;
        setIsSaved(true);
        toast.success("Saved to your opportunities");
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      toast.error("Failed to update saved status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-8">
          <p className="text-center text-muted-foreground">Opportunity not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/opportunities")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Opportunities
        </Button>

        {opportunity.banner_url && (
          <div className="w-full h-64 mb-6 rounded-lg overflow-hidden">
            <img
              src={opportunity.banner_url}
              alt={opportunity.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">
                      {opportunity.lab_profiles.lab_name}
                    </p>
                    <CardTitle className="text-3xl mb-4">{opportunity.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge>{opportunity.category}</Badge>
                      {opportunity.is_paid && <Badge variant="secondary">Paid</Badge>}
                      {opportunity.is_remote && <Badge variant="outline">Remote</Badge>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSaveToggle}
                  >
                    <Heart
                      className={`h-6 w-6 ${isSaved ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {opportunity.description}
                  </p>
                </div>

                {opportunity.responsibilities && (
                  <div>
                    <h3 className="font-semibold mb-2">Responsibilities</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {opportunity.responsibilities}
                    </p>
                  </div>
                )}

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.required_skills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>

                {opportunity.preferred_skills.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Preferred Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.preferred_skills.map((skill) => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-3">Required Training</h3>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.required_certifications.map((cert) => (
                      <Badge key={cert} variant="secondary">{cert}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lab Information */}
            <Card>
              <CardHeader>
                <CardTitle>About the Lab</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold">{opportunity.lab_profiles.lab_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {opportunity.lab_profiles.institution}
                  </p>
                  {opportunity.lab_profiles.department && (
                    <p className="text-sm text-muted-foreground">
                      {opportunity.lab_profiles.department}
                    </p>
                  )}
                </div>
                {opportunity.lab_profiles.description && (
                  <p className="text-muted-foreground">
                    {opportunity.lab_profiles.description}
                  </p>
                )}
                {opportunity.lab_profiles.contact_email && (
                  <p className="text-sm text-muted-foreground">
                    Contact: {opportunity.lab_profiles.contact_email}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{opportunity.location}</p>
                  </div>
                </div>

                {opportunity.hours_per_week && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Time Commitment</p>
                      <p className="text-sm text-muted-foreground">
                        {opportunity.hours_per_week} hours/week
                      </p>
                    </div>
                  </div>
                )}

                {opportunity.duration_months && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">
                        {opportunity.duration_months} months
                      </p>
                    </div>
                  </div>
                )}

                {opportunity.is_paid && opportunity.compensation_amount && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Compensation</p>
                      <p className="text-sm text-muted-foreground">
                        ${opportunity.compensation_amount}/hour
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Positions Available</p>
                    <p className="text-sm text-muted-foreground">
                      {opportunity.slots_available} slot{opportunity.slots_available !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {opportunity.min_gpa && (
                  <div>
                    <p className="text-sm font-medium mb-1">Minimum GPA</p>
                    <p className="text-sm text-muted-foreground">{opportunity.min_gpa}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              className="w-full"
              size="lg"
              onClick={() => setShowApplyModal(true)}
              disabled={hasApplied}
            >
              {hasApplied ? "Already Applied" : "Apply Now"}
            </Button>

            {hasApplied && (
              <p className="text-sm text-center text-muted-foreground">
                You've already applied to this opportunity
              </p>
            )}
          </div>
        </div>
      </div>

      <ApplyModal
        open={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        opportunityId={opportunity.id}
        opportunityTitle={opportunity.title}
        onSuccess={() => {
          setHasApplied(true);
          setShowApplyModal(false);
        }}
      />
    </div>
  );
};

export default OpportunityDetail;
