import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import logoWordmark from "@/assets/logo-wordmark.png";

const PostOpportunity = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [labProfileId, setLabProfileId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "research" as "research" | "clinical" | "volunteer",
    description: "",
    responsibilities: "",
    location: "",
    is_remote: false,
    is_paid: false,
    compensation_amount: "",
    hours_per_week: "",
    duration_months: "",
    start_date: "",
    slots_available: "1",
    required_skills: "",
    preferred_skills: "",
    required_certifications: "",
    min_gpa: "",
  });

  useEffect(() => {
    checkLabProfile();
  }, []);

  const checkLabProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data } = await supabase
      .from("lab_profiles")
      .select("id")
      .eq("user_id", session.user.id)
      .single();

    if (!data) {
      toast({
        title: "No lab profile found",
        description: "Please create a lab profile first",
        variant: "destructive"
      });
      navigate("/lab-dashboard");
      return;
    }

    setLabProfileId(data.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!labProfileId) return;

    setLoading(true);

    try {
      const { error } = await supabase.from("opportunities").insert({
        lab_profile_id: labProfileId,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        responsibilities: formData.responsibilities,
        location: formData.location,
        is_remote: formData.is_remote,
        is_paid: formData.is_paid,
        compensation_amount: formData.compensation_amount ? parseFloat(formData.compensation_amount) : null,
        hours_per_week: formData.hours_per_week ? parseInt(formData.hours_per_week) : null,
        duration_months: formData.duration_months ? parseInt(formData.duration_months) : null,
        start_date: formData.start_date || null,
        slots_available: parseInt(formData.slots_available),
        required_skills: formData.required_skills ? formData.required_skills.split(",").map(s => s.trim()) : [],
        preferred_skills: formData.preferred_skills ? formData.preferred_skills.split(",").map(s => s.trim()) : [],
        required_certifications: formData.required_certifications ? formData.required_certifications.split(",").map(s => s.trim()) : [],
        min_gpa: formData.min_gpa ? parseFloat(formData.min_gpa) : null,
        status: "draft",
      });

      if (error) throw error;

      toast({
        title: "Opportunity created!",
        description: "Your opportunity will be reviewed and published within 24 hours.",
      });
      navigate("/lab-dashboard");
    } catch (error: any) {
      toast({
        title: "Error creating opportunity",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <img src={logoWordmark} alt="MedBridge" className="h-8" />
            <Button variant="ghost" onClick={() => navigate("/lab-dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Post New Opportunity</CardTitle>
            <p className="text-sm text-muted-foreground">
              Fill in the details below. Your opportunity will be reviewed and published within 24 hours.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Role Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Research Assistant - Neuroscience Lab"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Role Type *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="clinical">Clinical</SelectItem>
                      <SelectItem value="volunteer">Volunteer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide a detailed description of the role and research project..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Responsibilities</Label>
                  <Textarea
                    id="responsibilities"
                    value={formData.responsibilities}
                    onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                    placeholder="List key responsibilities and daily tasks..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Location & Format */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location & Format</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Boston, MA or Remote"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_remote"
                    checked={formData.is_remote}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_remote: checked })}
                  />
                  <Label htmlFor="is_remote">Remote work available</Label>
                </div>
              </div>

              {/* Compensation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Compensation</h3>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_paid"
                    checked={formData.is_paid}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_paid: checked })}
                  />
                  <Label htmlFor="is_paid">Paid position</Label>
                </div>

                {formData.is_paid && (
                  <div className="space-y-2">
                    <Label htmlFor="compensation_amount">Hourly Rate ($)</Label>
                    <Input
                      id="compensation_amount"
                      type="number"
                      step="0.01"
                      value={formData.compensation_amount}
                      onChange={(e) => setFormData({ ...formData, compensation_amount: e.target.value })}
                      placeholder="e.g., 15.00"
                    />
                  </div>
                )}
              </div>

              {/* Time Commitment */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Time Commitment</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hours_per_week">Hours per Week</Label>
                    <Input
                      id="hours_per_week"
                      type="number"
                      value={formData.hours_per_week}
                      onChange={(e) => setFormData({ ...formData, hours_per_week: e.target.value })}
                      placeholder="e.g., 10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration_months">Duration (months)</Label>
                    <Input
                      id="duration_months"
                      type="number"
                      value={formData.duration_months}
                      onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                      placeholder="e.g., 6"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slots_available">Number of Positions *</Label>
                    <Input
                      id="slots_available"
                      type="number"
                      min="1"
                      value={formData.slots_available}
                      onChange={(e) => setFormData({ ...formData, slots_available: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Requirements</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="required_skills">Required Skills (comma-separated)</Label>
                  <Input
                    id="required_skills"
                    value={formData.required_skills}
                    onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })}
                    placeholder="e.g., Data analysis, Python, Lab techniques"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred_skills">Preferred Skills (comma-separated)</Label>
                  <Input
                    id="preferred_skills"
                    value={formData.preferred_skills}
                    onChange={(e) => setFormData({ ...formData, preferred_skills: e.target.value })}
                    placeholder="e.g., R programming, Previous research experience"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="required_certifications">Required Certifications (comma-separated)</Label>
                  <Input
                    id="required_certifications"
                    value={formData.required_certifications}
                    onChange={(e) => setFormData({ ...formData, required_certifications: e.target.value })}
                    placeholder="e.g., CITI Human Subjects, HIPAA"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min_gpa">Minimum GPA</Label>
                  <Input
                    id="min_gpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={formData.min_gpa}
                    onChange={(e) => setFormData({ ...formData, min_gpa: e.target.value })}
                    placeholder="e.g., 3.0"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={loading} size="lg" className="flex-1">
                  {loading ? "Submitting..." : "Submit for Review"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/lab-dashboard")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostOpportunity;
