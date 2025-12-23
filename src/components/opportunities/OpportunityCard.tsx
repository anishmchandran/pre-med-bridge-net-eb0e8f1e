import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Heart, Building2, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Opportunity } from "@/pages/Opportunities";
import { cn } from "@/lib/utils";

interface OpportunityCardProps {
  opportunity: Opportunity;
  isSaved: boolean;
  onSaveToggle: () => void;
}

const OpportunityCard = ({ opportunity, isSaved, onSaveToggle }: OpportunityCardProps) => {
  const navigate = useNavigate();

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      research: "bg-accent/10 text-accent border-accent/30",
      clinical: "bg-blue-500/10 text-blue-600 border-blue-500/30",
      volunteer: "bg-green-500/10 text-green-600 border-green-500/30",
      shadowing: "bg-purple-500/10 text-purple-600 border-purple-500/30",
      data: "bg-orange-500/10 text-orange-600 border-orange-500/30",
    };
    return colors[category] || "bg-muted text-muted-foreground border-border";
  };

  return (
    <Card 
      className={cn(
        "group floating-card transition-all duration-500 cursor-pointer",
        "hover:shadow-premium-lg hover:-translate-y-1",
        "border-0"
      )}
      onClick={() => navigate(`/opportunities/${opportunity.id}`)}
    >
      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/20 via-primary/10 to-accent/20 blur-sm" />
      </div>

      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            {/* Lab Info */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-muted/50">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {opportunity.lab_profiles.lab_name}
              </span>
            </div>

            <CardTitle className="text-xl font-semibold leading-tight group-hover:text-accent transition-colors duration-300">
              {opportunity.title}
            </CardTitle>
            
            <CardDescription className="line-clamp-2 text-muted-foreground/90">
              {opportunity.description}
            </CardDescription>
          </div>

          {/* Save Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onSaveToggle();
            }}
            className={cn(
              "shrink-0 h-10 w-10 rounded-xl transition-all duration-300",
              isSaved 
                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" 
                : "hover:bg-accent/10 text-muted-foreground hover:text-accent"
            )}
          >
            <Heart 
              className={cn(
                "h-5 w-5 transition-all duration-300",
                isSaved && "fill-red-500 scale-110"
              )} 
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-5 pt-0">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className={cn("border", getCategoryColor(opportunity.category))}>
            {opportunity.category}
          </Badge>
          {opportunity.is_paid && (
            <Badge className="bg-green-500/10 text-green-600 border border-green-500/30">
              <DollarSign className="h-3 w-3 mr-1" />
              Paid
            </Badge>
          )}
          {opportunity.is_remote && (
            <Badge variant="outline" className="border-accent/30 text-accent bg-accent/5">
              <Sparkles className="h-3 w-3 mr-1" />
              Remote
            </Badge>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30">
            <MapPin className="h-4 w-4 text-accent" />
            <span className="text-sm text-foreground truncate">{opportunity.location}</span>
          </div>
          {opportunity.hours_per_week && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-sm text-foreground">{opportunity.hours_per_week} hrs/week</span>
            </div>
          )}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30">
            <Building2 className="h-4 w-4 text-accent" />
            <span className="text-sm text-foreground truncate">{opportunity.lab_profiles.institution}</span>
          </div>
        </div>

        {/* Required Certifications */}
        {opportunity.required_certifications.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Required Training
            </p>
            <div className="flex flex-wrap gap-1.5">
              {opportunity.required_certifications.map((cert) => (
                <Badge 
                  key={cert} 
                  variant="outline" 
                  className="text-xs bg-muted/30 border-border/50"
                >
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {opportunity.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {opportunity.tags.slice(0, 5).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs bg-primary/5 text-primary border-primary/20"
              >
                {tag}
              </Badge>
            ))}
            {opportunity.tags.length > 5 && (
              <Badge variant="secondary" className="text-xs bg-muted/50">
                +{opportunity.tags.length - 5} more
              </Badge>
            )}
          </div>
        )}

        {/* CTA Button */}
        <Button 
          className={cn(
            "w-full h-11 group/btn relative overflow-hidden",
            "bg-gradient-to-r from-accent to-accent-light hover:from-accent-hover hover:to-accent",
            "text-accent-foreground font-medium",
            "shadow-glow transition-all duration-300"
          )}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/opportunities/${opportunity.id}`);
          }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            View Details & Apply
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default OpportunityCard;