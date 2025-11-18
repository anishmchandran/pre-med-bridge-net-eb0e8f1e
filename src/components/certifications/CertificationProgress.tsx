import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface CertificationProgressProps {
  certifications: any[];
}

const REQUIRED_CERTIFICATIONS = [
  "CITI Human Subjects Research",
  "HIPAA Training",
  "Bloodborne Pathogens",
];

export function CertificationProgress({ certifications }: CertificationProgressProps) {
  const verifiedCount = certifications.filter(cert => cert.verified).length;
  const pendingCount = certifications.filter(cert => !cert.verified).length;
  
  const now = new Date();
  const expiringCount = certifications.filter(cert => {
    if (!cert.expiration_date) return false;
    const expirationDate = new Date(cert.expiration_date);
    const daysUntilExpiration = Math.floor((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration > 0 && daysUntilExpiration <= 30;
  }).length;

  const requiredVerified = REQUIRED_CERTIFICATIONS.filter(reqCert =>
    certifications.some(cert => 
      cert.certification_name.toLowerCase().includes(reqCert.toLowerCase().split(' ')[0]) && 
      cert.verified
    )
  ).length;

  const progressPercentage = (requiredVerified / REQUIRED_CERTIFICATIONS.length) * 100;

  return (
    <Card className="p-6 mb-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-foreground">Training Progress</h3>
          <span className="text-sm font-medium text-primary">
            {requiredVerified} of {REQUIRED_CERTIFICATIONS.length} required trainings
          </span>
        </div>
        <Progress value={progressPercentage} className="h-3" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{verifiedCount}</p>
            <p className="text-sm text-muted-foreground">Verified</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-yellow-100">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
            <p className="text-sm text-muted-foreground">Pending Verification</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-orange-100">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{expiringCount}</p>
            <p className="text-sm text-muted-foreground">Expiring Soon</p>
          </div>
        </div>
      </div>

      {progressPercentage === 100 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            🎉 Compliance Complete! All required trainings verified.
          </p>
        </div>
      )}
    </Card>
  );
}
