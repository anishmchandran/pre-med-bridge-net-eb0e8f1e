import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ApplyModalProps {
  open: boolean;
  onClose: () => void;
  opportunityId: string;
  opportunityTitle: string;
  onSuccess: () => void;
}

const ApplyModal = ({ open, onClose, opportunityId, opportunityTitle, onSuccess }: ApplyModalProps) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (open) {
      loadProfile();
    }
  }, [open]);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleSubmit = async () => {
    if (!profile) {
      toast.error("Please complete your profile before applying");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("applications")
        .insert([{
          opportunity_id: opportunityId,
          user_id: user.id,
          cover_letter: coverLetter || null,
        }]);

      if (error) throw error;

      toast.success("Application submitted successfully!");
      onSuccess();
      setCoverLetter("");
    } catch (error: any) {
      console.error("Error submitting application:", error);
      if (error.code === "23505") {
        toast.error("You've already applied to this opportunity");
      } else {
        toast.error("Failed to submit application");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply to {opportunityTitle}</DialogTitle>
          <DialogDescription>
            Review your profile information that will be shared with the lab
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Summary */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Your Information</h4>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-sm">Name: {profile?.full_name || "Not set"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-sm">Email: {profile?.email}</span>
                </div>
                {profile?.school && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm">School: {profile.school}</span>
                  </div>
                )}
                {profile?.major && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm">Major: {profile.major}</span>
                  </div>
                )}
                {profile?.resume_url && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm">Resume attached</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            {profile?.skills && profile.skills.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Your Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Cover Letter */}
            <div className="space-y-2">
              <Label htmlFor="cover-letter">
                Cover Letter <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea
                id="cover-letter"
                placeholder="Tell the lab why you're interested in this opportunity and what makes you a great fit..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                Share your motivation, relevant experience, and what you hope to learn
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyModal;
