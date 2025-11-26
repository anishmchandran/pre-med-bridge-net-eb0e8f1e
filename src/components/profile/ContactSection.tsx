import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Link as LinkIcon, Linkedin, GraduationCap, Building2, Edit } from "lucide-react";
import { EditContactDialog } from "./EditContactDialog";

interface ContactSectionProps {
  profile: any;
  isOwnProfile: boolean;
  onUpdate?: (profileId: string) => void;
}

export function ContactSection({ profile, isOwnProfile, onUpdate }: ContactSectionProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  if (!profile) return null;

  const hasLinks = profile?.linkedin_url || profile?.orcid_link || profile?.pubmed_link || 
                   profile?.google_scholar_url || profile?.institutional_profile_url;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Contact & Links</CardTitle>
          {isOwnProfile && (
            <Button variant="ghost" size="icon" onClick={() => setShowEditDialog(true)}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {profile?.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${profile.email}`} className="text-primary hover:underline">
                {profile.email}
              </a>
            </div>
          )}
          {profile?.linkedin_url && (
            <div className="flex items-center gap-2 text-sm">
              <Linkedin className="h-4 w-4 text-muted-foreground" />
              <a 
                href={profile.linkedin_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                LinkedIn
              </a>
            </div>
          )}
          {profile?.orcid_link && (
            <div className="flex items-center gap-2 text-sm">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <a 
                href={profile.orcid_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                ORCID
              </a>
            </div>
          )}
          {profile?.pubmed_link && (
            <div className="flex items-center gap-2 text-sm">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <a 
                href={profile.pubmed_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                PubMed
              </a>
            </div>
          )}
          {profile?.google_scholar_url && (
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <a 
                href={profile.google_scholar_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Scholar
              </a>
            </div>
          )}
          {profile?.institutional_profile_url && (
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <a 
                href={profile.institutional_profile_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Faculty Profile
              </a>
            </div>
          )}
          {!profile?.email && !hasLinks && (
            <p className="text-sm text-muted-foreground">No contact information added yet.</p>
          )}
        </CardContent>
      </Card>

      {showEditDialog && onUpdate && (
        <EditContactDialog
          profile={profile}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}
