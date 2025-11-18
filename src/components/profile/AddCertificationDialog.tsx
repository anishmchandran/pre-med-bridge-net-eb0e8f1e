import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddCertificationDialogProps {
  profileId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function AddCertificationDialog({ profileId, open, onOpenChange, onUpdate }: AddCertificationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    certification_type: "",
    certification_name: "",
    issue_date: "",
    expiration_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("certifications").insert([
        {
          user_id: profileId,
          certification_type: formData.certification_type,
          certification_name: formData.certification_name,
          issue_date: formData.issue_date || null,
          expiration_date: formData.expiration_date || null,
          verified: false,
        },
      ]);

      if (error) throw error;

      toast.success("Certification added successfully");
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
          <DialogTitle>Add Certification</DialogTitle>
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
              {loading ? "Adding..." : "Add Certification"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}