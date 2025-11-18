import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, Clock, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RecentLogsTableProps {
  logs: any[];
  onRefresh: () => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "verified":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          Self-Logged
        </Badge>
      );
  }
};

const getExperienceTypeBadge = (type: string) => {
  const colors = {
    clinical: "bg-blue-100 text-blue-800",
    research: "bg-purple-100 text-purple-800",
    volunteer: "bg-green-100 text-green-800",
    shadowing: "bg-orange-100 text-orange-800",
    other: "bg-gray-100 text-gray-800",
  };
  return (
    <Badge variant="secondary" className={colors[type as keyof typeof colors]}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
};

export function RecentLogsTable({ logs, onRefresh }: RecentLogsTableProps) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("hour_logs").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete log entry",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Log entry deleted successfully",
      });
      onRefresh();
    }
  };

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hours logged yet. Click "Log Hours" to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead className="text-right">Hours</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Supervisor</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">
                {new Date(log.date).toLocaleDateString()}
              </TableCell>
              <TableCell>{log.role_title}</TableCell>
              <TableCell>{getExperienceTypeBadge(log.experience_type)}</TableCell>
              <TableCell>{log.organization}</TableCell>
              <TableCell className="text-right font-semibold">{parseFloat(log.hours).toFixed(1)}</TableCell>
              <TableCell>{getStatusBadge(log.verification_status)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {log.supervisor_name || "—"}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(log.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
