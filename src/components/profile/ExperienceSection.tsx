import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AddExperienceDialog } from "./AddExperienceDialog";

interface ExperienceSectionProps {
  profileId: string;
  isOwnProfile: boolean;
}

export function ExperienceSection({ profileId, isOwnProfile }: ExperienceSectionProps) {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadExperiences();
  }, [profileId]);

  const loadExperiences = async () => {
    const { data } = await supabase
      .from("experiences")
      .select("*")
      .eq("user_id", profileId)
      .order("start_date", { ascending: false });

    if (data) setExperiences(data);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Experience
          </CardTitle>
          {isOwnProfile && (
            <Button variant="ghost" size="icon" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {experiences.length === 0 ? (
            <p className="text-muted-foreground">No experience added yet.</p>
          ) : (
            experiences.map((exp) => (
              <div key={exp.id} className="border-l-2 border-primary pl-4">
                <h4 className="font-semibold">{exp.role_title}</h4>
                <p className="text-sm text-muted-foreground">{exp.organization}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                </p>
                {exp.supervisor && (
                  <p className="text-xs text-muted-foreground">Supervisor: {exp.supervisor}</p>
                )}
                {exp.description && (
                  <p className="text-sm mt-2">{exp.description}</p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {showAddDialog && (
        <AddExperienceDialog
          profileId={profileId}
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onUpdate={loadExperiences}
        />
      )}
    </>
  );
}