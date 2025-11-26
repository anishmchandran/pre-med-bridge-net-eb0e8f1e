import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ExperienceDialog } from "./ExperienceDialog";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ExperienceSectionProps {
  profileId: string;
  isOwnProfile: boolean;
}

export function ExperienceSection({ profileId, isOwnProfile }: ExperienceSectionProps) {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (profileId) {
      loadExperiences();
    }
  }, [profileId]);

  const loadExperiences = async () => {
    if (!profileId) return;
    
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

  const handleEdit = (exp: any) => {
    setEditingExperience(exp);
    setShowDialog(true);
  };

  const handleAdd = () => {
    setEditingExperience(null);
    setShowDialog(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const { error } = await supabase
        .from("experiences")
        .delete()
        .eq("id", deleteId);
      
      if (error) throw error;
      toast.success("Experience deleted successfully");
      loadExperiences();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeleteId(null);
    }
  };

  if (!profileId) return null;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Experience
          </CardTitle>
          {isOwnProfile && (
            <Button variant="ghost" size="icon" onClick={handleAdd}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {experiences.length === 0 ? (
            <p className="text-muted-foreground">No experience added yet.</p>
          ) : (
            experiences.map((exp) => (
              <div key={exp.id} className="border-l-2 border-primary pl-4 group relative">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
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
                  {isOwnProfile && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(exp)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(exp.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <ExperienceDialog
        profileId={profileId}
        experience={editingExperience}
        open={showDialog}
        onOpenChange={setShowDialog}
        onUpdate={loadExperiences}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Experience</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this experience entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
