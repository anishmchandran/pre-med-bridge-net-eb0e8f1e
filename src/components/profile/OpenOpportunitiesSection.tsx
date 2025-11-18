import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Opportunity {
  id: string;
  title: string;
  category: string;
  location: string;
  hours_per_week: number;
  is_paid: boolean;
  is_remote: boolean;
  slots_available: number;
}

interface OpenOpportunitiesSectionProps {
  profileId: string;
}

export function OpenOpportunitiesSection({ profileId }: OpenOpportunitiesSectionProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOpportunities();
  }, [profileId]);

  const loadOpportunities = async () => {
    try {
      // Get all labs owned by this user
      const { data: labs } = await supabase
        .from("lab_profiles")
        .select("id")
        .eq("user_id", profileId);

      if (!labs || labs.length === 0) {
        setLoading(false);
        return;
      }

      const labIds = labs.map(lab => lab.id);

      // Get active opportunities from these labs
      const { data, error } = await supabase
        .from("opportunities")
        .select("id, title, category, location, hours_per_week, is_paid, is_remote, slots_available")
        .in("lab_profile_id", labIds)
        .eq("status", "active")
        .eq("verified", true)
        .limit(5);

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error("Error loading opportunities:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || opportunities.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <CardTitle>Open Opportunities</CardTitle>
        </div>
        <CardDescription>Current research positions available</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {opportunities.map((opp) => (
            <div 
              key={opp.id}
              className="border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/opportunities/${opp.id}`)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold mb-2 truncate">{opp.title}</h4>
                  
                  <div className="flex flex-wrap gap-2 text-sm">
                    <Badge variant="secondary">
                      {opp.category}
                    </Badge>
                    
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{opp.is_remote ? "Remote" : opp.location}</span>
                    </div>

                    {opp.hours_per_week && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{opp.hours_per_week} hrs/week</span>
                      </div>
                    )}

                    {opp.is_paid && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        <span>Paid</span>
                      </div>
                    )}
                  </div>

                  {opp.slots_available > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {opp.slots_available} position{opp.slots_available !== 1 ? 's' : ''} available
                    </p>
                  )}
                </div>

                <Button variant="outline" size="sm">
                  Apply
                </Button>
              </div>
            </div>
          ))}
        </div>

        {opportunities.length >= 5 && (
          <Button 
            variant="ghost" 
            className="w-full mt-4"
            onClick={() => navigate("/opportunities")}
          >
            View All Opportunities
          </Button>
        )}
      </CardContent>
    </Card>
  );
}