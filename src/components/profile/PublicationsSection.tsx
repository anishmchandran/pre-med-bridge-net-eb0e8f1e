import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PublicationsSectionProps {
  profile: any;
}

export function PublicationsSection({ profile }: PublicationsSectionProps) {
  const [expanded, setExpanded] = useState(false);

  // Mock publications - in production, this would fetch from ORCID/PubMed API
  const mockPublications = [
    {
      title: "Novel approaches in translational neuroscience research",
      journal: "Nature Neuroscience",
      year: "2024",
      authors: ["Smith, J.", "Jones, A.", "Williams, R."],
      url: profile?.pubmed_link || "#"
    },
    {
      title: "Advanced molecular techniques in clinical diagnostics",
      journal: "Cell",
      year: "2023",
      authors: ["Smith, J.", "Brown, K.", "Davis, M.", "Wilson, P."],
      url: profile?.pubmed_link || "#"
    },
    {
      title: "Integrating computational methods in biomedical research",
      journal: "Science Advances",
      year: "2023",
      authors: ["Smith, J.", "Taylor, E."],
      url: profile?.pubmed_link || "#"
    },
  ];

  const hasPublications = profile?.orcid_link || profile?.pubmed_link;
  const visiblePublications = expanded ? mockPublications : mockPublications.slice(0, 3);

  if (!hasPublications) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>Research & Publications</CardTitle>
          </div>
          {profile?.pubmed_link && (
            <Button variant="outline" size="sm" asChild>
              <a href={profile.pubmed_link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                PubMed
              </a>
            </Button>
          )}
        </div>
        <CardDescription>Recent publications and research contributions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {visiblePublications.map((pub, index) => (
          <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
            <a 
              href={pub.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold hover:text-primary transition-colors"
            >
              {pub.title}
            </a>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {pub.journal}
              </Badge>
              <span className="text-sm text-muted-foreground">{pub.year}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {pub.authors.slice(0, 3).join(", ")}
              {pub.authors.length > 3 && ` +${pub.authors.length - 3} more`}
            </p>
          </div>
        ))}

        {mockPublications.length > 3 && (
          <Button 
            variant="ghost" 
            onClick={() => setExpanded(!expanded)}
            className="w-full"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Show All ({mockPublications.length} total)
              </>
            )}
          </Button>
        )}

        <div className="flex gap-2 pt-2">
          {profile?.orcid_link && (
            <Button variant="outline" size="sm" asChild>
              <a href={profile.orcid_link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                ORCID
              </a>
            </Button>
          )}
          {profile?.google_scholar_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={profile.google_scholar_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Google Scholar
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}