import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Heart, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Opportunity } from "@/pages/Opportunities";

interface OpportunityCardProps {
  opportunity: Opportunity;
  isSaved: boolean;
  onSaveToggle: () => void;
}

const OpportunityCard = ({ opportunity, isSaved, onSaveToggle }: OpportunityCardProps) => {
  const navigate = useNavigate();

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      research: "bg-primary/10 text-primary",
      clinical: "bg-blue-500/10 text-blue-600",
      volunteer: "bg-green-500/10 text-green-600",
      shadowing: "bg-purple-500/10 text-purple-600",
      data: "bg-orange-500/10 text-orange-600",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/opportunities/${opportunity.id}`)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                {opportunity.lab_profiles.lab_name}
              </span>
            </div>
            <CardTitle className="text-xl mb-2">{opportunity.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {opportunity.description}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onSaveToggle();
            }}
            className="shrink-0"
          >
            <Heart 
              className={`h-5 w-5 ${isSaved ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} 
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getCategoryColor(opportunity.category)}>
              {opportunity.category}
            </Badge>
            {opportunity.is_paid && (
              <Badge variant="secondary">
                <DollarSign className="h-3 w-3 mr-1" />
                Paid
              </Badge>
            )}
            {opportunity.is_remote && (
              <Badge variant="outline">Remote</Badge>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{opportunity.location}</span>
            </div>
            {opportunity.hours_per_week && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{opportunity.hours_per_week} hrs/week</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              <span>{opportunity.lab_profiles.institution}</span>
            </div>
          </div>

          {/* Required Certifications */}
          {opportunity.required_certifications.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Required Training:
              </p>
              <div className="flex flex-wrap gap-1">
                {opportunity.required_certifications.map((cert) => (
                  <Badge key={cert} variant="outline" className="text-xs">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {opportunity.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {opportunity.tags.slice(0, 5).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Button 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/opportunities/${opportunity.id}`);
            }}
          >
            View Details & Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpportunityCard;
