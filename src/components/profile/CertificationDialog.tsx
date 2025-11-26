import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CertificationData {
  id?: string;
  certification_type: string;
  certification_name: string;
  issue_date: string | null;
  expiration_date: string | null;
}

interface CertificationDialogProps {
  profileId: string;
  certification?: CertificationData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function CertificationDialog({ profileId, certification, open, onOpenChange, onUpdate }: CertificationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    certification_type: "",
    certification_name: "",
    issue_date: "",
    expiration_date: "",
  });

  const isEditing = !!certification?.id;

  useEffect(() => {
    if (certification) {
      setFormData({
        certification_type: certification.certification_type || "",
        certification_name: certification.certification_name || "",
        issue_date: certification.issue_date || "",
        expiration_date: certification.expiration_date || "",
      });
    } else {
      setFormData({
        certification_type: "",
        certification_name: "",
        issue_date: "",
        expiration_date: "",
      });
    }
  }, [certification, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        certification_type: formData.certification_type,
        certification_name: formData.certification_name,
        issue_date: formData.issue_date || null,
        expiration_date: formData.expiration_date || null,
      };

      if (isEditing && certification?.id) {
        const { error } = await supabase
          .from("certifications")
          .update(data)
          .eq("id", certification.id);
        if (error) throw error;
        toast.success("Certification updated successfully");
      } else {
        const { error } = await supabase.from("certifications").insert([
          { ...data, user_id: profileId, verified: false },
        ]);
        if (error) throw error;
        toast.success("Certification added successfully");
      }

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
          <DialogTitle>{isEditing ? "Edit Certification" : "Add Certification"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="certification_type">Certification Type</Label>
            <Select
              required
              value={formData.certification_type}
              onValueChange={(value) => setFormData({ ...formData, certification_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CITI">CITI Human Subjects</SelectItem>
                <SelectItem value="HIPAA">HIPAA Training</SelectItem>
                <SelectItem value="BBP">Bloodborne Pathogens</SelectItem>
                <SelectItem value="GCP">Good Clinical Practice</SelectItem>
                <SelectItem value="IRB">IRB Training</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="certification_name">Certification Name</Label>
            <Input
              id="certification_name"
              required
              value={formData.certification_name}
              onChange={(e) => setFormData({ ...formData, certification_name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input
                id="issue_date"
                type="date"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="expiration_date">Expiration Date</Label>
              <Input
                id="expiration_date"
                type="date"
                value={formData.expiration_date}
                onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Add Certification"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
