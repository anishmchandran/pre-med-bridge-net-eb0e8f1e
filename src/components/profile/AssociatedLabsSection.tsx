import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Lab {
  id: string;
  lab_name: string;
  institution: string;
  department: string;
  description: string;
  verified: boolean;
  _count?: { opportunities: number };
}

interface AssociatedLabsSectionProps {
  profileId: string;
}

export function AssociatedLabsSection({ profileId }: AssociatedLabsSectionProps) {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadLabs();
  }, [profileId]);

  const loadLabs = async () => {
    try {
      const { data, error } = await supabase
        .from("lab_profiles")
        .select(`
          id,
          lab_name,
          institution,
          department,
          description,
          verified
        `)
        .eq("user_id", profileId)
        .eq("verified", true);

      if (error) throw error;

      // For each lab, count opportunities
      if (data) {
        const labsWithCounts = await Promise.all(
          data.map(async (lab) => {
            const { count } = await supabase
              .from("opportunities")
              .select("*", { count: "exact", head: true })
              .eq("lab_profile_id", lab.id)
              .eq("status", "active");
            
            return {
              ...lab,
              _count: { opportunities: count || 0 }
            };
          })
        );
        setLabs(labsWithCounts);
      }
    } catch (error) {
      console.error("Error loading labs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || labs.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <CardTitle>Associated Labs</CardTitle>
        </div>
        <CardDescription>Research laboratories and facilities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {labs.map((lab) => (
          <div 
            key={lab.id}
            className="border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => navigate(`/lab/${lab.id}`)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-lg truncate">{lab.lab_name}</h4>
                  {lab.verified && (
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="truncate">{lab.institution}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{lab.department}</span>
                  </div>
                </div>

                {lab.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {lab.description}
                  </p>
                )}

                {lab._count && lab._count.opportunities > 0 && (
                  <div className="mt-3">
                    <Badge variant="outline" className="text-primary">
                      {lab._count.opportunities} Active Opening{lab._count.opportunities !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                )}
              </div>

              <Button variant="ghost" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}