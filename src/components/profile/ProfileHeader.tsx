import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Mail, MessageCircle, Share2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EditProfileDialog } from "./EditProfileDialog";

interface ProfileHeaderProps {
  profile: any;
  isOwnProfile: boolean;
  onUpdate: (userId: string) => void;
}

export function ProfileHeader({ profile, isOwnProfile, onUpdate }: ProfileHeaderProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      toast.success("Profile photo updated");
      onUpdate(profile.id);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || '?';
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-secondary" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row gap-4 -mt-16 mb-4">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                <AvatarFallback className="text-2xl">
                  {getInitials(profile?.full_name)}
                </AvatarFallback>
              </Avatar>
              {isOwnProfile && (
                <label className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90">
                  <Edit className="h-4 w-4" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>

            <div className="flex-1 sm:mt-16">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-3xl font-bold text-foreground">
                      {profile?.full_name}
                    </h1>
                    {profile?.verified && (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Verified {profile?.title ? 'PI' : 'User'}
                      </Badge>
                    )}
                  </div>
                  
                  {profile?.title ? (
                    // PI-specific header
                    <>
                      <p className="text-lg font-semibold text-foreground mt-1">
                        {profile.title}
                      </p>
                      <p className="text-muted-foreground">
                        {profile?.department && `${profile.department} • `}
                        {profile?.school}
                      </p>
                    </>
                  ) : (
                    // Student/general user header
                    <>
                      <p className="text-lg text-muted-foreground mt-1">
                        {profile?.academic_status || 'Student'}
                      </p>
                      <p className="text-muted-foreground">
                        {profile?.school} {profile?.major && `• ${profile.major}`}
                      </p>
                    </>
                  )}
                  
                  {profile?.location && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {profile.location}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  {isOwnProfile ? (
                    <>
                      <Button onClick={() => setShowEditDialog(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {showEditDialog && (
        <EditProfileDialog
          profile={profile}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}