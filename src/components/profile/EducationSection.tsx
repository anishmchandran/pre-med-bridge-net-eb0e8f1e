import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, GraduationCap, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { EducationDialog } from "./EducationDialog";
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

interface EducationSectionProps {
  profileId: string;
  isOwnProfile: boolean;
}

export function EducationSection({ profileId, isOwnProfile }: EducationSectionProps) {
  const [education, setEducation] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingEducation, setEditingEducation] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (profileId) {
      loadEducation();
    }
  }, [profileId]);

  const loadEducation = async () => {
    if (!profileId) return;
    
    const { data } = await supabase
      .from("education")
      .select("*")
      .eq("user_id", profileId)
      .order("graduation_year", { ascending: false });

    if (data) setEducation(data);
  };

  const handleEdit = (edu: any) => {
    setEditingEducation(edu);
    setShowDialog(true);
  };

  const handleAdd = () => {
    setEditingEducation(null);
    setShowDialog(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const { error } = await supabase
        .from("education")
        .delete()
        .eq("id", deleteId);
      
      if (error) throw error;
      toast.success("Education deleted successfully");
      loadEducation();
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
            <GraduationCap className="h-5 w-5" />
            Education
          </CardTitle>
          {isOwnProfile && (
            <Button variant="ghost" size="icon" onClick={handleAdd}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {education.length === 0 ? (
            <p className="text-muted-foreground">No education added yet.</p>
          ) : (
            education.map((edu) => (
              <div key={edu.id} className="border-l-2 border-primary pl-4 group relative">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{edu.school_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {edu.degree} in {edu.major}
                    </p>
                    {edu.graduation_year && (
                      <p className="text-xs text-muted-foreground">
                        Class of {edu.graduation_year}
                      </p>
                    )}
                    {edu.gpa && edu.gpa_visible && (
                      <p className="text-xs text-muted-foreground">GPA: {edu.gpa}</p>
                    )}
                  </div>
                  {isOwnProfile && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(edu)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(edu.id)}>
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

      <EducationDialog
        profileId={profileId}
        education={editingEducation}
        open={showDialog}
        onOpenChange={setShowDialog}
        onUpdate={loadEducation}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Education</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this education entry? This action cannot be undone.
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
