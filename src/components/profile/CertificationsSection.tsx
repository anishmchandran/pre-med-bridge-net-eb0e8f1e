import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Award, ShieldCheck, ShieldAlert, Shield, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CertificationDialog } from "./CertificationDialog";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CertificationsSectionProps {
  profileId: string;
  isOwnProfile: boolean;
}

export function CertificationsSection({ profileId, isOwnProfile }: CertificationsSectionProps) {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCertification, setEditingCertification] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (profileId) {
      loadCertifications();
    }
  }, [profileId]);

  const loadCertifications = async () => {
    if (!profileId) return;

    const { data } = await supabase
      .from("certifications")
      .select("*")
      .eq("user_id", profileId)
      .order("issue_date", { ascending: false });

    if (data) setCertifications(data);
  };

  const getCertificationIcon = (verified: boolean | null, expirationDate: string | null) => {
    if (verified) return <ShieldCheck className="h-4 w-4 text-green-500" />;
    if (expirationDate && new Date(expirationDate) < new Date()) {
      return <ShieldAlert className="h-4 w-4 text-destructive" />;
    }
    return <Shield className="h-4 w-4 text-muted-foreground" />;
  };

  const handleEdit = (cert: any) => {
    setEditingCertification(cert);
    setShowDialog(true);
  };

  const handleAdd = () => {
    setEditingCertification(null);
    setShowDialog(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const { error } = await supabase
        .from("certifications")
        .delete()
        .eq("id", deleteId);
      
      if (error) throw error;
      toast.success("Certification deleted successfully");
      loadCertifications();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeleteId(null);
    }
  };

  if (!profileId) return null;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Training & Certifications
          </CardTitle>
          {isOwnProfile && (
            <Button variant="ghost" size="icon" onClick={handleAdd}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {certifications.length === 0 ? (
            <p className="text-muted-foreground">No certifications added yet.</p>
          ) : (
            certifications.map((cert) => (
              <div key={cert.id} className="flex items-start justify-between border-b pb-3 last:border-0 group">
                <div className="flex items-start gap-3">
                  {getCertificationIcon(cert.verified, cert.expiration_date)}
                  <div>
                    <h4 className="font-medium">{cert.certification_name}</h4>
                    <p className="text-sm text-muted-foreground">{cert.certification_type}</p>
                    {cert.expiration_date && (
                      <p className="text-xs text-muted-foreground">
                        Expires: {new Date(cert.expiration_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {cert.verified ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                  {isOwnProfile && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(cert)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(cert.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <CertificationDialog
        profileId={profileId}
        certification={editingCertification}
        open={showDialog}
        onOpenChange={setShowDialog}
        onUpdate={loadCertifications}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Certification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this certification? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
