import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Edit, Save, X, Plus, Microscope } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ResearchInterestsSectionProps {
  profileId: string;
  interests: string;
  isOwnProfile: boolean;
}

export function ResearchInterestsSection({ profileId, interests, isOwnProfile }: ResearchInterestsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [interestText, setInterestText] = useState(interests || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ research_focus: interestText })
        .eq("id", profileId);

      if (error) throw error;

      toast.success("Research interests updated");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Microscope className="h-4 w-4" />
          Research Interests
        </CardTitle>
        {isOwnProfile && !isEditing && (
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
            <Edit className="h-3 w-3" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={interestText}
              onChange={(e) => setInterestText(e.target.value)}
              placeholder="e.g., Oncology, Neuroscience"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} disabled={loading}>
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => {
                setIsEditing(false);
                setInterestText(interests || "");
              }}>
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {interests || "No research interests specified."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}