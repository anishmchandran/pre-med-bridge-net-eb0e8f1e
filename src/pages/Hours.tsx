import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Download } from "lucide-react";
import { AddHourLogDialog } from "@/components/hours/AddHourLogDialog";
import { HoursSummary } from "@/components/hours/HoursSummary";
import { HoursChart } from "@/components/hours/HoursChart";
import { RecentLogsTable } from "@/components/hours/RecentLogsTable";
import { useToast } from "@/hooks/use-toast";

export default function Hours() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [hourLogs, setHourLogs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      fetchHourLogs(user.id);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchHourLogs(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchHourLogs = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("hour_logs")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load hour logs",
        variant: "destructive",
      });
    } else {
      setHourLogs(data || []);
    }
    setLoading(false);
  };

  const handleLogAdded = () => {
    if (user) {
      fetchHourLogs(user.id);
    }
    setShowAddDialog(false);
  };

  const handleExport = () => {
    toast({
      title: "Export Coming Soon",
      description: "PDF export functionality will be available soon",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Hour Tracking</h1>
            <p className="text-muted-foreground">Log and verify your research and clinical experience</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Log Hours
            </Button>
          </div>
        </div>

        <HoursSummary logs={hourLogs} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Hours by Category</h3>
            <HoursChart logs={hourLogs} />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart coming soon
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Logs</h3>
          <RecentLogsTable logs={hourLogs} onRefresh={() => user && fetchHourLogs(user.id)} />
        </Card>
      </div>

      <AddHourLogDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={handleLogAdded}
      />
    </div>
  );
}
