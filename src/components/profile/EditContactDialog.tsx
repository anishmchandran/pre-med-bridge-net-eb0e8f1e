import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EditContactDialogProps {
  profile: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (profileId: string) => void;
}

export function EditContactDialog({ profile, open, onOpenChange, onUpdate }: EditContactDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    linkedin_url: "",
    orcid_link: "",
    pubmed_link: "",
    google_scholar_url: "",
    institutional_profile_url: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        linkedin_url: profile.linkedin_url || "",
        orcid_link: profile.orcid_link || "",
        pubmed_link: profile.pubmed_link || "",
        google_scholar_url: profile.google_scholar_url || "",
        institutional_profile_url: profile.institutional_profile_url || "",
      });
    }
  }, [profile, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update(formData)
        .eq("id", profile.id);

      if (error) throw error;

      toast.success("Contact information updated");
      onUpdate(profile.id);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Contact & Links</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="orcid_link">ORCID Link</Label>
            <Input
              id="orcid_link"
              type="url"
              placeholder="https://orcid.org/0000-0000-0000-0000"
              value={formData.orcid_link}
              onChange={(e) => setFormData({ ...formData, orcid_link: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="pubmed_link">PubMed Link</Label>
            <Input
              id="pubmed_link"
              type="url"
              placeholder="https://pubmed.ncbi.nlm.nih.gov/?term=..."
              value={formData.pubmed_link}
              onChange={(e) => setFormData({ ...formData, pubmed_link: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="google_scholar_url">Google Scholar URL</Label>
            <Input
              id="google_scholar_url"
              type="url"
              placeholder="https://scholar.google.com/citations?user=..."
              value={formData.google_scholar_url}
              onChange={(e) => setFormData({ ...formData, google_scholar_url: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="institutional_profile_url">Faculty/Institutional Profile URL</Label>
            <Input
              id="institutional_profile_url"
              type="url"
              placeholder="https://university.edu/faculty/yourprofile"
              value={formData.institutional_profile_url}
              onChange={(e) => setFormData({ ...formData, institutional_profile_url: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
