import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Link as LinkIcon, Linkedin, GraduationCap, Building2 } from "lucide-react";

interface ContactSectionProps {
  profile: any;
  isOwnProfile: boolean;
}

export function ContactSection({ profile, isOwnProfile }: ContactSectionProps) {
  if (!profile) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Contact & Links</CardTitle>
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
      </CardContent>
    </Card>
  );
}