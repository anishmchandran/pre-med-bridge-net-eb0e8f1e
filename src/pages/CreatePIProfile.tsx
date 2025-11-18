import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Loader2, CheckCircle2, User, GraduationCap, FileText, Link } from "lucide-react";

interface PIFormData {
  full_name: string;
  title: string;
  school: string;
  department: string;
  email: string;
  bio: string;
  research_focus: string;
  skills: string[];
  orcid_link: string;
  pubmed_link: string;
  linkedin_url: string;
  google_scholar_url: string;
  institutional_profile_url: string;
}

export default function CreatePIProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<PIFormData>({
    full_name: "",
    title: "",
    school: "",
    department: "",
    email: "",
    bio: "",
    research_focus: "",
    skills: [],
    orcid_link: "",
    pubmed_link: "",
    linkedin_url: "",
    google_scholar_url: "",
    institutional_profile_url: "",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUserId(user.id);
    
    // Check if profile already exists
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    if (profile?.title && profile?.department) {
      toast.info("You already have a PI profile");
      navigate("/lab-dashboard");
    }
  };

  const updateField = (field: keyof PIFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.full_name || !formData.title || !formData.school || !formData.department) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.email) {
        toast.error("Email is required for verification");
        return;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
    }
    
    if (currentStep === 3) {
      if (!formData.bio || !formData.research_focus) {
        toast.error("Please provide your bio and research focus");
        return;
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Update profile with PI information
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          title: formData.title,
          school: formData.school,
          department: formData.department,
          email: formData.email,
          bio: formData.bio,
          research_focus: formData.research_focus,
          skills: formData.skills,
          orcid_link: formData.orcid_link || null,
          pubmed_link: formData.pubmed_link || null,
          linkedin_url: formData.linkedin_url || null,
          google_scholar_url: formData.google_scholar_url || null,
          institutional_profile_url: formData.institutional_profile_url || null,
          verified: false, // Will be verified by admin
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      // Assign PI role
      const { error: roleError } = await supabase
        .from("user_roles")
        .upsert({
          user_id: userId,
          role: "admin", // Using admin role for PIs
        }, {
          onConflict: "user_id,role"
        });

      if (roleError) throw roleError;

      toast.success("PI profile created successfully! It will be verified within 24 hours.");
      
      // Show connect to lab prompt
      const shouldCreateLab = window.confirm(
        "Would you like to create a lab profile now?\n\nClick OK to create a new lab, or Cancel to do this later."
      );
      
      if (shouldCreateLab) {
        navigate("/lab-profile/create");
      } else {
        navigate("/lab-dashboard");
      }
    } catch (error) {
      console.error("Error creating PI profile:", error);
      toast.error("Failed to create PI profile");
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your PI Profile</h1>
          <p className="text-muted-foreground">
            Establish your verified identity as a Principal Investigator
          </p>
          <Progress value={progress} className="mt-4" />
          <p className="text-sm text-muted-foreground mt-2">Step {currentStep} of 4</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && "Personal Information"}
                  {currentStep === 2 && "Verification"}
                  {currentStep === 3 && "Professional Overview"}
                  {currentStep === 4 && "Optional Links"}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Tell us about your academic position"}
                  {currentStep === 2 && "Verify your institutional affiliation"}
                  {currentStep === 3 && "Share your research focus and expertise"}
                  {currentStep === 4 && "Connect your professional profiles"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentStep === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => updateField("full_name", e.target.value)}
                        placeholder="Dr. Jane Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Academic Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        placeholder="Associate Professor, Principal Investigator"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school">Institution *</Label>
                      <Input
                        id="school"
                        value={formData.school}
                        onChange={(e) => updateField("school", e.target.value)}
                        placeholder="Ohio State University"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => updateField("department", e.target.value)}
                        placeholder="Department of Molecular Biology"
                      />
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="email">Institutional Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="jane.smith@osu.edu"
                      />
                      <p className="text-sm text-muted-foreground">
                        Use your official .edu or institutional email for auto-verification
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="institutional_profile_url">Faculty Profile URL (Optional)</Label>
                      <Input
                        id="institutional_profile_url"
                        value={formData.institutional_profile_url}
                        onChange={(e) => updateField("institutional_profile_url", e.target.value)}
                        placeholder="https://university.edu/faculty/jsmith"
                      />
                      <p className="text-sm text-muted-foreground">
                        Link to your official faculty webpage for verification
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Verification Process
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Profiles using .edu emails are typically verified within 24 hours. 
                        You'll receive an email confirmation once approved.
                      </p>
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Research Summary *</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => updateField("bio", e.target.value)}
                        placeholder="Brief overview of your research background and interests..."
                        rows={4}
                        maxLength={500}
                      />
                      <p className="text-sm text-muted-foreground">
                        {formData.bio.length}/500 characters
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="research_focus">Research Focus Areas *</Label>
                      <Textarea
                        id="research_focus"
                        value={formData.research_focus}
                        onChange={(e) => updateField("research_focus", e.target.value)}
                        placeholder="Oncology, Neuroscience, Public Health..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="skills">Research Methods & Keywords</Label>
                      <Input
                        id="skills"
                        value={formData.skills.join(", ")}
                        onChange={(e) => updateField("skills", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                        placeholder="PCR, Flow Cytometry, Statistical Analysis..."
                      />
                      <p className="text-sm text-muted-foreground">
                        Separate keywords with commas
                      </p>
                    </div>
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect your professional profiles to enhance credibility. All fields are optional.
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="orcid_link">ORCID URL</Label>
                      <Input
                        id="orcid_link"
                        value={formData.orcid_link}
                        onChange={(e) => updateField("orcid_link", e.target.value)}
                        placeholder="https://orcid.org/0000-0000-0000-0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pubmed_link">PubMed URL</Label>
                      <Input
                        id="pubmed_link"
                        value={formData.pubmed_link}
                        onChange={(e) => updateField("pubmed_link", e.target.value)}
                        placeholder="https://pubmed.ncbi.nlm.nih.gov/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="google_scholar_url">Google Scholar</Label>
                      <Input
                        id="google_scholar_url"
                        value={formData.google_scholar_url}
                        onChange={(e) => updateField("google_scholar_url", e.target.value)}
                        placeholder="https://scholar.google.com/citations?user=..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin_url">LinkedIn</Label>
                      <Input
                        id="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={(e) => updateField("linkedin_url", e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-2 pt-4">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                  )}
                  {currentStep < 4 ? (
                    <Button onClick={handleNext} className="ml-auto">
                      Next
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={loading} className="ml-auto">
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Profile...
                        </>
                      ) : (
                        "Create My PI Profile"
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {formData.full_name || "Your Name"}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {formData.title || "Academic Title"}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <span className="truncate">
                      {formData.school || "Institution"}
                    </span>
                  </div>
                  {formData.department && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span className="truncate">{formData.department}</span>
                    </div>
                  )}
                </div>

                {formData.bio && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {formData.bio}
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t space-y-2">
                  <p className="text-xs font-semibold">Step Progress:</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-2 flex-1 rounded ${
                          step <= currentStep ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}