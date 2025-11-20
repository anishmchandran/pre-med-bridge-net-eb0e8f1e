import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Edit, Save, X, Plus, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SkillsSectionProps {
  profile: any;
  isOwnProfile: boolean;
  onUpdate: (userId: string) => void;
}

export function SkillsSection({ profile, isOwnProfile, onUpdate }: SkillsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState<string[]>(profile?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);

  if (!profile) return null;

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ skills })
        .eq("id", profile.id);

      if (error) throw error;

      toast.success("Skills updated");
      setIsEditing(false);
      onUpdate(profile.id);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Skills & Techniques
        </CardTitle>
        {isOwnProfile && !isEditing && (
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill (e.g., PCR, MATLAB, Patient Care)"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              />
              <Button type="button" onClick={handleAddSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleRemoveSkill(skill)}
                >
                  {skill} ×
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => {
                setIsEditing(false);
                setSkills(profile?.skills || []);
              }}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.length === 0 ? (
              <p className="text-muted-foreground">No skills added yet.</p>
            ) : (
              skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}