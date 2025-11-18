import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, Clock, XCircle, Download, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CertificationTableProps {
  certifications: any[];
  onRefresh: () => void;
}

const getStatusBadge = (cert: any) => {
  const now = new Date();
  
  if (cert.verified) {
    if (cert.expiration_date && new Date(cert.expiration_date) < now) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Verified
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
      <Clock className="h-3 w-3 mr-1" />
      Pending
    </Badge>
  );
};

const getExpirationWarning = (expirationDate: string | null) => {
  if (!expirationDate) return null;
  
  const now = new Date();
  const expiration = new Date(expirationDate);
  const daysUntilExpiration = Math.floor((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiration < 0) {
    return <XCircle className="h-4 w-4 text-red-600" />;
  }
  
  if (daysUntilExpiration <= 30) {
    return <AlertTriangle className="h-4 w-4 text-orange-600" />;
  }
  
  return null;
};

export function CertificationTable({ certifications, onRefresh }: CertificationTableProps) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("certifications").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete certification",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Certification deleted successfully",
      });
      onRefresh();
    }
  };

  const handleDownload = (documentUrl: string | null, certName: string) => {
    if (!documentUrl) {
      toast({
        title: "No Document",
        description: "This certification doesn't have an uploaded document",
        variant: "destructive",
      });
      return;
    }
    window.open(documentUrl, "_blank");
  };

  if (certifications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No certifications found. Upload your first certification to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Certification</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Expiration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certifications.map((cert) => {
            const expirationWarning = getExpirationWarning(cert.expiration_date);
            
            return (
              <TableRow key={cert.id}>
                <TableCell className="font-medium">{cert.certification_name}</TableCell>
                <TableCell>{cert.certification_type}</TableCell>
                <TableCell>{getStatusBadge(cert)}</TableCell>
                <TableCell>
                  {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {cert.expiration_date ? new Date(cert.expiration_date).toLocaleDateString() : "No expiration"}
                    {expirationWarning}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {cert.document_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(cert.document_url, cert.certification_name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cert.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
