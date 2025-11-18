import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Check, Upload } from "lucide-react";
import logoWordmark from "@/assets/logo-wordmark.png";

const CreateLabProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Step 1: Lab Identity
    lab_name: "",
    department: "",
    institution: "",
    pi_name: "",
    contact_email: "",
    
    // Step 2: Verification
    institutional_email: "",
    verification_document: null as File | null,
    
    // Step 3: Research Overview
    description: "",
    research_focus: "",
    research_tags: "",
    methods: "",
    
    // Step 4: Team & Contact
    lab_manager_emails: "",
    website: "",
    banner_url: "",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUserId(session.user.id);

    // Check if lab profile already exists
    const { data } = await supabase
      .from("lab_profiles")
      .select("id")
      .eq("user_id", session.user.id)
      .single();

    if (data) {
      toast({
        title: "Lab profile already exists",
        description: "Redirecting to dashboard...",
      });
      navigate("/lab-dashboard");
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const { error } = await supabase.from("lab_profiles").insert({
        user_id: userId,
        lab_name: formData.lab_name,
        department: formData.department,
        institution: formData.institution,
        description: formData.description,
        research_focus: formData.research_focus,
        contact_email: formData.contact_email || formData.institutional_email,
        website: formData.website,
        verified: false, // Will be verified by admin
      });

      if (error) throw error;

      toast({
        title: "🎉 Lab profile created!",
        description: "Your lab profile is pending verification. This typically takes less than 24 hours.",
      });

      navigate("/lab-dashboard");
    } catch (error: any) {
      toast({
        title: "Error creating lab profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <img src={logoWordmark} alt="MedBridge" className="h-8" />
            <Button variant="ghost" onClick={() => navigate("/lab-dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Step {currentStep} of 4</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Step Menu */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Setup Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`flex items-center gap-3 p-3 rounded-lg ${currentStep >= 1 ? 'bg-primary/10' : 'bg-muted/50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep > 1 ? 'bg-primary text-primary-foreground' : currentStep === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {currentStep > 1 ? <Check className="h-4 w-4" /> : '1'}
                  </div>
                  <span className="font-medium">Lab Identity</span>
                </div>

                <div className={`flex items-center gap-3 p-3 rounded-lg ${currentStep >= 2 ? 'bg-primary/10' : 'bg-muted/50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep > 2 ? 'bg-primary text-primary-foreground' : currentStep === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {currentStep > 2 ? <Check className="h-4 w-4" /> : '2'}
                  </div>
                  <span className="font-medium">Verification</span>
                </div>

                <div className={`flex items-center gap-3 p-3 rounded-lg ${currentStep >= 3 ? 'bg-primary/10' : 'bg-muted/50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep > 3 ? 'bg-primary text-primary-foreground' : currentStep === 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {currentStep > 3 ? <Check className="h-4 w-4" /> : '3'}
                  </div>
                  <span className="font-medium">Research Overview</span>
                </div>

                <div className={`flex items-center gap-3 p-3 rounded-lg ${currentStep === 4 ? 'bg-primary/10' : 'bg-muted/50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 4 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    4
                  </div>
                  <span className="font-medium">Team & Contact</span>
                </div>
              </CardContent>
            </Card>

            {/* Live Preview Card */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Profile Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {formData.lab_name && (
                    <div>
                      <p className="font-semibold">{formData.lab_name}</p>
                    </div>
                  )}
                  {formData.institution && (
                    <p className="text-muted-foreground">{formData.institution}</p>
                  )}
                  {formData.department && (
                    <p className="text-muted-foreground text-xs">{formData.department}</p>
                  )}
                  {formData.research_focus && (
                    <p className="text-xs mt-2">{formData.research_focus}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - Form Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && "Lab Identity"}
                  {currentStep === 2 && "Verification"}
                  {currentStep === 3 && "Research Overview"}
                  {currentStep === 4 && "Team & Contact"}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Basic information about your lab or research group"}
                  {currentStep === 2 && "Verify your institutional affiliation"}
                  {currentStep === 3 && "Tell us about your research focus and areas"}
                  {currentStep === 4 && "Add team members and contact information"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Step 1: Lab Identity */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="lab_name">Lab Name *</Label>
                      <Input
                        id="lab_name"
                        value={formData.lab_name}
                        onChange={(e) => setFormData({ ...formData, lab_name: e.target.value })}
                        placeholder="e.g., Smith Neuroscience Lab"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution *</Label>
                      <Input
                        id="institution"
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        placeholder="e.g., Ohio State University"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="e.g., Department of Neuroscience"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pi_name">Principal Investigator Name *</Label>
                      <Input
                        id="pi_name"
                        value={formData.pi_name}
                        onChange={(e) => setFormData({ ...formData, pi_name: e.target.value })}
                        placeholder="e.g., Dr. Jane Smith"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Lab Email *</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                        placeholder="e.g., smith.lab@osu.edu"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Verification */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="institutional_email">Institutional Email *</Label>
                      <Input
                        id="institutional_email"
                        type="email"
                        value={formData.institutional_email}
                        onChange={(e) => setFormData({ ...formData, institutional_email: e.target.value })}
                        placeholder="e.g., smith.1@osu.edu"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Use your official institutional email (@edu domain) for automatic verification
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="verification_document">Verification Document (Optional)</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload IRB letterhead or faculty profile link
                        </p>
                        <Input
                          id="verification_document"
                          type="file"
                          accept=".pdf,.jpg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData({ ...formData, verification_document: file });
                            }
                          }}
                          className="max-w-xs mx-auto"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        <strong>Note:</strong> Your lab profile will be verified within 24 hours. 
                        Once verified, you can start posting opportunities.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Research Overview */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Lab Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief description of your lab's research focus and mission (max 500 characters)"
                        rows={4}
                        maxLength={500}
                        required
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {formData.description.length}/500 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="research_focus">Primary Research Focus *</Label>
                      <Input
                        id="research_focus"
                        value={formData.research_focus}
                        onChange={(e) => setFormData({ ...formData, research_focus: e.target.value })}
                        placeholder="e.g., Cognitive Neuroscience, Cancer Biology"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="research_tags">Research Tags (comma-separated)</Label>
                      <Input
                        id="research_tags"
                        value={formData.research_tags}
                        onChange={(e) => setFormData({ ...formData, research_tags: e.target.value })}
                        placeholder="e.g., Oncology, Neuroscience, Public Health, Immunology"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="methods">Methods & Techniques</Label>
                      <Textarea
                        id="methods"
                        value={formData.methods}
                        onChange={(e) => setFormData({ ...formData, methods: e.target.value })}
                        placeholder="e.g., fMRI, Flow Cytometry, CRISPR, RNA-Seq"
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Team & Contact */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="lab_manager_emails">Lab Manager/Coordinator Emails</Label>
                      <Textarea
                        id="lab_manager_emails"
                        value={formData.lab_manager_emails}
                        onChange={(e) => setFormData({ ...formData, lab_manager_emails: e.target.value })}
                        placeholder="Enter email addresses (one per line) for team members who can help manage postings"
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        These users will be able to manage applicants and postings
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Lab Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="e.g., https://smithlab.osu.edu"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="banner">Lab Photo/Banner (Optional)</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload a banner image for your lab profile
                        </p>
                        <Input
                          id="banner"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // In a real implementation, you would upload to storage here
                              console.log("Banner file selected:", file);
                            }
                          }}
                          className="max-w-xs mx-auto"
                        />
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                      <p className="text-sm text-green-900 dark:text-green-100">
                        <strong>Almost done!</strong> Once you publish your profile, 
                        it will be reviewed and verified within 24 hours.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  )}
                  
                  {currentStep < 4 ? (
                    <Button onClick={handleNext} className="ml-auto">
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={loading} className="ml-auto">
                      {loading ? "Publishing..." : "Publish My Lab Profile"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLabProfile;
