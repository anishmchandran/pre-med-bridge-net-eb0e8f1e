import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AddCertificationDialog } from "./AddCertificationDialog";

interface CertificationsSectionProps {
  profileId: string;
  isOwnProfile: boolean;
}

export function CertificationsSection({ profileId, isOwnProfile }: CertificationsSectionProps) {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);

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

  const getCertificationIcon = (verified: boolean) => {
    return verified ? (
      <CheckCircle2 className="h-5 w-5 text-green-600" />
    ) : (
      <AlertCircle className="h-5 w-5 text-yellow-600" />
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Training & Certifications
          </CardTitle>
          {isOwnProfile && (
            <Button variant="ghost" size="icon" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {certifications.length === 0 ? (
            <p className="text-muted-foreground">No certifications added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-start gap-3 p-4 border rounded-lg"
                >
                  {getCertificationIcon(cert.verified)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{cert.certification_name}</h4>
                      <Badge variant={cert.verified ? "default" : "secondary"}>
                        {cert.verified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {cert.certification_type}
                    </p>
                    {cert.issue_date && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Issued: {new Date(cert.issue_date).toLocaleDateString()}
                      </p>
                    )}
                    {cert.expiration_date && (
                      <p className="text-xs text-muted-foreground">
                        Expires: {new Date(cert.expiration_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showAddDialog && (
        <AddCertificationDialog
          profileId={profileId}
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onUpdate={loadCertifications}
        />
      )}
    </>
  );
}