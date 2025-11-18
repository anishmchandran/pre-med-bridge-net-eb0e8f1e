import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddExperienceDialogProps {
  profileId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function AddExperienceDialog({ profileId, open, onOpenChange, onUpdate }: AddExperienceDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role_title: "",
    organization: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
    supervisor: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("experiences").insert([
        {
          user_id: profileId,
          role_title: formData.role_title,
          organization: formData.organization,
          start_date: formData.start_date,
          end_date: formData.is_current ? null : formData.end_date,
          is_current: formData.is_current,
          description: formData.description || null,
          supervisor: formData.supervisor || null,
        },
      ]);

      if (error) throw error;

      toast.success("Experience added successfully");
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Experience</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="role_title">Role Title</Label>
            <Input
              id="role_title"
              required
              value={formData.role_title}
              onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="organization">Organization / Lab</Label>
            <Input
              id="organization"
              required
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                disabled={formData.is_current}
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_current"
              checked={formData.is_current}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, is_current: checked as boolean, end_date: "" })
              }
            />
            <Label htmlFor="is_current">I currently work here</Label>
          </div>
          <div>
            <Label htmlFor="supervisor">Supervisor (Optional)</Label>
            <Input
              id="supervisor"
              value={formData.supervisor}
              onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Describe your responsibilities and achievements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Experience"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}