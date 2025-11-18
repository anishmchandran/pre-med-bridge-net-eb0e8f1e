import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Save, X, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AvailabilitySectionProps {
  profileId: string;
  availability: any;
  isOwnProfile: boolean;
  onUpdate: (userId: string) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening'];

export function AvailabilitySection({ profileId, availability, isOwnProfile, onUpdate }: AvailabilitySectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [schedule, setSchedule] = useState<any>(availability || {});
  const [loading, setLoading] = useState(false);

  const toggleSlot = (day: string, slot: string) => {
    setSchedule((prev: any) => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [slot]: !(prev[day]?.[slot] || false)
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ weekly_availability: schedule })
        .eq("id", profileId);

      if (error) throw error;

      toast.success("Availability updated");
      setIsEditing(false);
      onUpdate(profileId);
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
          <Calendar className="h-5 w-5" />
          Weekly Availability
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
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="font-semibold">Day</div>
              {TIME_SLOTS.map(slot => (
                <div key={slot} className="font-semibold text-center">{slot}</div>
              ))}
              {DAYS.map(day => (
                <>
                  <div key={day} className="py-2">{day}</div>
                  {TIME_SLOTS.map(slot => (
                    <div key={`${day}-${slot}`} className="flex justify-center py-2">
                      <Checkbox
                        checked={schedule[day]?.[slot] || false}
                        onCheckedChange={() => toggleSlot(day, slot)}
                      />
                    </div>
                  ))}
                </>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => {
                setIsEditing(false);
                setSchedule(availability || {});
              }}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 text-sm">
            <div className="font-semibold">Day</div>
            {TIME_SLOTS.map(slot => (
              <div key={slot} className="font-semibold text-center">{slot}</div>
            ))}
            {DAYS.map(day => (
              <>
                <div key={day} className="py-2">{day}</div>
                {TIME_SLOTS.map(slot => (
                  <div key={`${day}-${slot}`} className="flex justify-center py-2">
                    {schedule[day]?.[slot] ? "✓" : "-"}
                  </div>
                ))}
              </>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}