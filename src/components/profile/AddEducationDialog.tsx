import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddEducationDialogProps {
  profileId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function AddEducationDialog({ profileId, open, onOpenChange, onUpdate }: AddEducationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    school_name: "",
    degree: "",
    major: "",
    graduation_year: "",
    gpa: "",
    gpa_visible: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("education").insert([
        {
          user_id: profileId,
          school_name: formData.school_name,
          degree: formData.degree,
          major: formData.major,
          graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
          gpa: formData.gpa ? parseFloat(formData.gpa) : null,
          gpa_visible: formData.gpa_visible,
        },
      ]);

      if (error) throw error;

      toast.success("Education added successfully");
      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Education</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="school_name">School Name</Label>
            <Input
              id="school_name"
              required
              value={formData.school_name}
              onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                required
                placeholder="e.g., Bachelor's"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="major">Major</Label>
              <Input
                id="major"
                required
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="graduation_year">Graduation Year</Label>
              <Input
                id="graduation_year"
                type="number"
                placeholder="2026"
                value={formData.graduation_year}
                onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="gpa">GPA</Label>
              <Input
                id="gpa"
                type="number"
                step="0.01"
                placeholder="3.85"
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="gpa_visible"
              checked={formData.gpa_visible}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, gpa_visible: checked as boolean })
              }
            />
            <Label htmlFor="gpa_visible">Show GPA publicly</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Education"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}