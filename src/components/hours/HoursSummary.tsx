import { Card } from "@/components/ui/card";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

interface HoursSummaryProps {
  logs: any[];
}

export function HoursSummary({ logs }: HoursSummaryProps) {
  const totalHours = logs.reduce((sum, log) => sum + parseFloat(log.hours || 0), 0);
  const verifiedHours = logs
    .filter((log) => log.verification_status === "verified")
    .reduce((sum, log) => sum + parseFloat(log.hours || 0), 0);
  const pendingHours = logs
    .filter((log) => log.verification_status === "pending")
    .reduce((sum, log) => sum + parseFloat(log.hours || 0), 0);

  const clinicalHours = logs
    .filter((log) => log.experience_type === "clinical")
    .reduce((sum, log) => sum + parseFloat(log.hours || 0), 0);
  const researchHours = logs
    .filter((log) => log.experience_type === "research")
    .reduce((sum, log) => sum + parseFloat(log.hours || 0), 0);
  const volunteerHours = logs
    .filter((log) => log.experience_type === "volunteer")
    .reduce((sum, log) => sum + parseFloat(log.hours || 0), 0);

  const lastVerified = logs
    .filter((log) => log.verification_status === "verified")
    .sort((a, b) => new Date(b.verification_date).getTime() - new Date(a.verification_date).getTime())[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-medium text-muted-foreground">Total Hours</h3>
        </div>
        <p className="text-3xl font-bold text-foreground">{totalHours.toFixed(1)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Clinical: {clinicalHours.toFixed(1)} • Research: {researchHours.toFixed(1)} • Volunteer: {volunteerHours.toFixed(1)}
        </p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <h3 className="text-sm font-medium text-muted-foreground">Verified Hours</h3>
        </div>
        <p className="text-3xl font-bold text-foreground">{verifiedHours.toFixed(1)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {lastVerified
            ? `Last verified: ${new Date(lastVerified.verification_date).toLocaleDateString()}`
            : "No verified hours yet"}
        </p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <h3 className="text-sm font-medium text-muted-foreground">Pending Verification</h3>
        </div>
        <p className="text-3xl font-bold text-foreground">{pendingHours.toFixed(1)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {logs.filter((log) => log.verification_status === "pending").length} entries awaiting verification
        </p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <h3 className="text-sm font-medium text-muted-foreground">This Month</h3>
        </div>
        <p className="text-3xl font-bold text-foreground">
          {logs
            .filter((log) => {
              const logDate = new Date(log.date);
              const now = new Date();
              return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
            })
            .reduce((sum, log) => sum + parseFloat(log.hours || 0), 0)
            .toFixed(1)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {logs.filter((log) => {
            const logDate = new Date(log.date);
            const now = new Date();
            return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
          }).length}{" "}
          entries this month
        </p>
      </Card>
    </div>
  );
}
