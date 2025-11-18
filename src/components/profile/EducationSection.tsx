import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AddEducationDialog } from "./AddEducationDialog";

interface EducationSectionProps {
  profileId: string;
  isOwnProfile: boolean;
}

export function EducationSection({ profileId, isOwnProfile }: EducationSectionProps) {
  const [education, setEducation] = useState<any[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadEducation();
  }, [profileId]);

  const loadEducation = async () => {
    const { data } = await supabase
      .from("education")
      .select("*")
      .eq("user_id", profileId)
      .order("graduation_year", { ascending: false });

    if (data) setEducation(data);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education
          </CardTitle>
          {isOwnProfile && (
            <Button variant="ghost" size="icon" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {education.length === 0 ? (
            <p className="text-muted-foreground">No education added yet.</p>
          ) : (
            education.map((edu) => (
              <div key={edu.id} className="border-l-2 border-primary pl-4">
                <h4 className="font-semibold">{edu.school_name}</h4>
                <p className="text-sm text-muted-foreground">
                  {edu.degree} in {edu.major}
                </p>
                {edu.graduation_year && (
                  <p className="text-sm text-muted-foreground">Class of {edu.graduation_year}</p>
                )}
                {edu.gpa_visible && edu.gpa && (
                  <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {showAddDialog && (
        <AddEducationDialog
          profileId={profileId}
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onUpdate={loadEducation}
        />
      )}
    </>
  );
}