import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AddHourLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddHourLogDialog({ open, onOpenChange, onSuccess }: AddHourLogDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    experience_type: "research",
    organization: "",
    role_title: "",
    supervisor_name: "",
    supervisor_email: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    hours: "",
    location: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to log hours",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("hour_logs").insert([{
      user_id: user.id,
      experience_type: formData.experience_type as any,
      organization: formData.organization,
      role_title: formData.role_title,
      supervisor_name: formData.supervisor_name || null,
      supervisor_email: formData.supervisor_email || null,
      description: formData.description || null,
      date: formData.date,
      hours: parseFloat(formData.hours),
      location: formData.location || null,
      verification_status: "self_logged" as any,
    }]);

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to log hours",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Hours logged successfully",
      });
      setFormData({
        experience_type: "research",
        organization: "",
        role_title: "",
        supervisor_name: "",
        supervisor_email: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        hours: "",
        location: "",
      });
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Hours</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience_type">Experience Type *</Label>
              <Select
                value={formData.experience_type}
                onValueChange={(value) => setFormData({ ...formData, experience_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clinical">Clinical</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="shadowing">Shadowing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organization">Organization *</Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="Hospital, Lab, or Clinic name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role_title">Role/Position *</Label>
              <Input
                id="role_title"
                value={formData.role_title}
                onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                placeholder="e.g., Research Assistant"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Hours Worked *</Label>
              <Input
                id="hours"
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                placeholder="e.g., 4.5"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Main Campus Lab"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supervisor_name">Supervisor Name</Label>
              <Input
                id="supervisor_name"
                value={formData.supervisor_name}
                onChange={(e) => setFormData({ ...formData, supervisor_name: e.target.value })}
                placeholder="Dr. Smith"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supervisor_email">Supervisor Email</Label>
              <Input
                id="supervisor_email"
                type="email"
                value={formData.supervisor_email}
                onChange={(e) => setFormData({ ...formData, supervisor_email: e.target.value })}
                placeholder="supervisor@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of activities (max 250 characters)"
              maxLength={250}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/250 characters
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Log Hours"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
