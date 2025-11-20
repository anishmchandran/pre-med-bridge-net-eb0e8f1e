import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EditProfileDialogProps {
  profile: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (userId: string) => void;
}

export function EditProfileDialog({ profile, open, onOpenChange, onUpdate }: EditProfileDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    academic_status: profile?.academic_status || "",
    school: profile?.school || "",
    major: profile?.major || "",
    location: profile?.location || "",
    year: profile?.year || "",
  });

  if (!profile?.id) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update(formData)
        .eq("id", profile.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="academic_status">Academic Status</Label>
              <Input
                id="academic_status"
                placeholder="e.g., Undergraduate, Pre-Med"
                value={formData.academic_status}
                onChange={(e) => setFormData({ ...formData, academic_status: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="school">School</Label>
              <Input
                id="school"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="major">Major</Label>
              <Input
                id="major"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                placeholder="e.g., Sophomore, 2026"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
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