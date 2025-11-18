import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, Clock, XCircle, FileText, Shield, AlertTriangle, FlaskConical } from "lucide-react";

interface CertificationBadgeGridProps {
  certifications: any[];
}

const getBadgeIcon = (certName: string) => {
  const name = certName.toLowerCase();
  if (name.includes("citi") || name.includes("human subjects")) {
    return <FileText className="h-8 w-8" />;
  }
  if (name.includes("hipaa")) {
    return <Shield className="h-8 w-8" />;
  }
  if (name.includes("bloodborne") || name.includes("bbp")) {
    return <AlertTriangle className="h-8 w-8" />;
  }
  return <FlaskConical className="h-8 w-8" />;
};

const getBadgeColor = (certName: string) => {
  const name = certName.toLowerCase();
  if (name.includes("citi") || name.includes("human subjects")) {
    return "from-blue-500 to-blue-600";
  }
  if (name.includes("hipaa")) {
    return "from-teal-500 to-teal-600";
  }
  if (name.includes("bloodborne") || name.includes("bbp")) {
    return "from-orange-500 to-orange-600";
  }
  return "from-purple-500 to-purple-600";
};

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
    
    if (cert.expiration_date) {
      const expirationDate = new Date(cert.expiration_date);
      const daysUntilExpiration = Math.floor((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiration <= 30 && daysUntilExpiration > 0) {
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Expiring Soon
          </Badge>
        );
      }
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

export function CertificationBadgeGrid({ certifications }: CertificationBadgeGridProps) {
  if (certifications.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-muted">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No Certifications Yet</h3>
            <p className="text-sm text-muted-foreground">
              Upload your first certification to get started
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {certifications.map((cert) => {
        const icon = getBadgeIcon(cert.certification_name);
        const colorClass = getBadgeColor(cert.certification_name);
        const statusBadge = getStatusBadge(cert);
        
        return (
          <TooltipProvider key={cert.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-lg bg-gradient-to-br ${colorClass} text-white`}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1 truncate">
                        {cert.certification_name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {cert.certification_type}
                      </p>
                      {statusBadge}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border space-y-1">
                    {cert.issue_date && (
                      <p className="text-xs text-muted-foreground">
                        Issued: {new Date(cert.issue_date).toLocaleDateString()}
                      </p>
                    )}
                    {cert.expiration_date && (
                      <p className="text-xs text-muted-foreground">
                        Expires: {new Date(cert.expiration_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p className="font-semibold">{cert.certification_name}</p>
                  {cert.verified ? (
                    <p className="text-xs">Verified by MedBridge</p>
                  ) : (
                    <p className="text-xs">Pending verification</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}
