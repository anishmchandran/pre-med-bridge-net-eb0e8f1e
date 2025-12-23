import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, X, MapPin, Clock, GraduationCap, FlaskConical, Laptop, Calendar, Filter, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EnhancedFilters {
  // Location
  city: string;
  state: string;
  radiusMiles: number;
  
  // Opportunity Type
  opportunityTypes: string[];
  
  // Area of Research
  researchAreas: string[];
  
  // Lab Type
  labTypes: string[];
  
  // Modality
  modalities: string[];
  
  // Time Commitment
  minHoursPerWeek: number;
  maxHoursPerWeek: number;
  
  // PI Education
  piEducationLevels: string[];
  
  // Minimum Requirements
  minYearInSchool: string;
  priorExperienceRequired: string;
  
  // Duration
  durations: string[];
  
  // Legacy filters for compatibility
  category: string;
  isPaid: string;
  isRemote: string;
  certifications: string[];
}

interface EnhancedFiltersPanelProps {
  filters: EnhancedFilters;
  setFilters: React.Dispatch<React.SetStateAction<EnhancedFilters>>;
}

const FilterSection = ({ 
  title, 
  icon: Icon, 
  children, 
  defaultOpen = false,
  accentColor = "accent"
}: { 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
  defaultOpen?: boolean;
  accentColor?: string;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className={cn(
        "flex items-center justify-between w-full py-3.5 px-4 rounded-xl transition-all duration-300 group",
        "hover:bg-accent/5 hover:shadow-sm",
        isOpen && "bg-accent/5"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-1.5 rounded-lg transition-all duration-300",
            isOpen ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent"
          )}>
            <Icon className="h-4 w-4" />
          </div>
          <span className={cn(
            "font-medium text-sm transition-colors duration-300",
            isOpen ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
          )}>
            {title}
          </span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-all duration-300",
          isOpen && "rotate-180 text-accent"
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 pt-2 space-y-3 animate-accordion-down">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

const PillCheckbox = ({ 
  label, 
  checked, 
  onChange 
}: { 
  label: string; 
  checked: boolean; 
  onChange: (checked: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={cn(
      "px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-300 pill-interactive",
      "border-2 shadow-sm",
      checked 
        ? "bg-accent text-accent-foreground border-accent shadow-glow" 
        : "bg-card text-foreground border-border/60 hover:border-accent/40 hover:bg-accent/5"
    )}
  >
    {label}
  </button>
);

const EnhancedFiltersPanel = ({ filters, setFilters }: EnhancedFiltersPanelProps) => {
  const opportunityTypes = [
    { value: "paid", label: "Paid" },
    { value: "unpaid", label: "Unpaid" },
    { value: "credit", label: "For Credit" },
    { value: "stipend", label: "Stipend" },
    { value: "other", label: "Other" },
  ];

  const researchAreas = [
    "Neuroscience",
    "Oncology",
    "Infectious Disease",
    "Public Health",
    "Cardiovascular",
    "Behavioral Science",
    "Immunology",
    "Genetics",
    "Pharmacology",
    "Epidemiology",
  ];

  const labTypes = [
    { value: "wet", label: "Wet Lab" },
    { value: "dry", label: "Dry Lab" },
    { value: "computational", label: "Computational / Data" },
    { value: "clinical", label: "Clinical Research" },
    { value: "hybrid", label: "Hybrid" },
  ];

  const modalities = [
    { value: "in-person", label: "In-Person" },
    { value: "hybrid", label: "Hybrid" },
    { value: "remote", label: "Remote" },
  ];

  const piEducationLevels = [
    { value: "md", label: "MD" },
    { value: "phd", label: "PhD" },
    { value: "md-phd", label: "MD/PhD" },
    { value: "do", label: "DO" },
    { value: "mph", label: "MPH" },
    { value: "resident", label: "Resident / Fellow" },
    { value: "postdoc", label: "Postdoc" },
    { value: "other", label: "Other" },
  ];

  const yearInSchoolOptions = [
    { value: "", label: "Any" },
    { value: "freshman", label: "Freshman" },
    { value: "sophomore", label: "Sophomore" },
    { value: "junior", label: "Junior" },
    { value: "senior", label: "Senior" },
    { value: "post-bac", label: "Post-Bac" },
    { value: "graduate", label: "Graduate" },
  ];

  const durations = [
    { value: "short-term", label: "Short-term (<3 months)" },
    { value: "semester", label: "Semester-long" },
    { value: "summer", label: "Summer Only" },
    { value: "year", label: "Year-long" },
    { value: "multi-year", label: "Multi-year" },
  ];

  const toggleArrayFilter = (key: keyof EnhancedFilters, value: string) => {
    setFilters(prev => {
      const currentArray = prev[key] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(v => v !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      city: "",
      state: "",
      radiusMiles: 50,
      opportunityTypes: [],
      researchAreas: [],
      labTypes: [],
      modalities: [],
      minHoursPerWeek: 0,
      maxHoursPerWeek: 40,
      piEducationLevels: [],
      minYearInSchool: "",
      priorExperienceRequired: "",
      durations: [],
      category: "",
      isPaid: "",
      isRemote: "",
      certifications: [],
    });
  };

  const activeFilterCount = 
    (filters.city ? 1 : 0) +
    (filters.state ? 1 : 0) +
    filters.opportunityTypes.length +
    filters.researchAreas.length +
    filters.labTypes.length +
    filters.modalities.length +
    (filters.minHoursPerWeek > 0 || filters.maxHoursPerWeek < 40 ? 1 : 0) +
    filters.piEducationLevels.length +
    (filters.minYearInSchool ? 1 : 0) +
    (filters.priorExperienceRequired ? 1 : 0) +
    filters.durations.length;

  return (
    <Card className="floating-card overflow-hidden border-0">
      {/* Header */}
      <div className="relative p-5 border-b border-border/30">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
              <Filter className="h-5 w-5 text-accent" />
            </div>
            <div>
              <span className="font-semibold text-foreground">Filters</span>
              {activeFilterCount > 0 && (
                <Badge className="ml-2 bg-accent/10 text-accent border-accent/30 hover:bg-accent/20">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {activeFilterCount} active
                </Badge>
              )}
            </div>
          </div>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <CardContent className="p-0 divide-y divide-border/30">
        {/* Location */}
        <FilterSection title="Location" icon={MapPin} defaultOpen>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">City</Label>
              <Input
                placeholder="Any city"
                value={filters.city}
                onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                className="h-10 text-sm bg-muted/30 border-border/50 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">State</Label>
              <Input
                placeholder="Any state"
                value={filters.state}
                onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                className="h-10 text-sm bg-muted/30 border-border/50 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all duration-300"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Search Radius</Label>
              <span className="text-xs font-medium text-accent">{filters.radiusMiles} miles</span>
            </div>
            <Slider
              value={[filters.radiusMiles]}
              onValueChange={([value]) => setFilters(prev => ({ ...prev, radiusMiles: value }))}
              max={200}
              min={5}
              step={5}
              className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent [&_[role=slider]]:shadow-glow"
            />
          </div>
        </FilterSection>

        {/* Opportunity Type */}
        <FilterSection title="Opportunity Type" icon={GraduationCap} defaultOpen>
          <div className="flex flex-wrap gap-2">
            {opportunityTypes.map(type => (
              <PillCheckbox
                key={type.value}
                label={type.label}
                checked={filters.opportunityTypes.includes(type.value)}
                onChange={() => toggleArrayFilter("opportunityTypes", type.value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Area of Research */}
        <FilterSection title="Area of Research" icon={FlaskConical}>
          <div className="flex flex-wrap gap-2">
            {researchAreas.map(area => (
              <PillCheckbox
                key={area}
                label={area}
                checked={filters.researchAreas.includes(area)}
                onChange={() => toggleArrayFilter("researchAreas", area)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Lab Type */}
        <FilterSection title="Lab Type" icon={FlaskConical}>
          <div className="flex flex-wrap gap-2">
            {labTypes.map(type => (
              <PillCheckbox
                key={type.value}
                label={type.label}
                checked={filters.labTypes.includes(type.value)}
                onChange={() => toggleArrayFilter("labTypes", type.value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Modality */}
        <FilterSection title="Modality" icon={Laptop} defaultOpen>
          <div className="flex flex-wrap gap-2">
            {modalities.map(mod => (
              <PillCheckbox
                key={mod.value}
                label={mod.label}
                checked={filters.modalities.includes(mod.value)}
                onChange={() => toggleArrayFilter("modalities", mod.value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Time Commitment */}
        <FilterSection title="Weekly Time Commitment" icon={Clock}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={40}
                value={filters.minHoursPerWeek}
                onChange={(e) => setFilters(prev => ({ ...prev, minHoursPerWeek: Number(e.target.value) }))}
                className="h-10 w-20 text-sm text-center bg-muted/30 border-border/50 focus:border-accent/50"
              />
              <span className="text-sm text-muted-foreground">to</span>
              <Input
                type="number"
                min={0}
                max={40}
                value={filters.maxHoursPerWeek}
                onChange={(e) => setFilters(prev => ({ ...prev, maxHoursPerWeek: Number(e.target.value) }))}
                className="h-10 w-20 text-sm text-center bg-muted/30 border-border/50 focus:border-accent/50"
              />
              <span className="text-sm text-muted-foreground">hrs/week</span>
            </div>
            <Slider
              value={[filters.minHoursPerWeek, filters.maxHoursPerWeek]}
              onValueChange={([min, max]) => setFilters(prev => ({ 
                ...prev, 
                minHoursPerWeek: min,
                maxHoursPerWeek: max 
              }))}
              max={40}
              min={0}
              step={1}
              className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent"
            />
          </div>
        </FilterSection>

        {/* PI Education Level */}
        <FilterSection title="PI Education Level" icon={GraduationCap}>
          <div className="flex flex-wrap gap-2">
            {piEducationLevels.map(level => (
              <PillCheckbox
                key={level.value}
                label={level.label}
                checked={filters.piEducationLevels.includes(level.value)}
                onChange={() => toggleArrayFilter("piEducationLevels", level.value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Minimum Requirements */}
        <FilterSection title="Requirements" icon={GraduationCap}>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Minimum Year in School</Label>
              <div className="flex flex-wrap gap-2">
                {yearInSchoolOptions.map(option => (
                  <PillCheckbox
                    key={option.value || "any"}
                    label={option.label}
                    checked={filters.minYearInSchool === option.value}
                    onChange={() => setFilters(prev => ({ ...prev, minYearInSchool: option.value }))}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Prior Research Experience</Label>
              <div className="flex gap-2">
                <PillCheckbox
                  label="Any"
                  checked={filters.priorExperienceRequired === ""}
                  onChange={() => setFilters(prev => ({ ...prev, priorExperienceRequired: "" }))}
                />
                <PillCheckbox
                  label="Required"
                  checked={filters.priorExperienceRequired === "yes"}
                  onChange={() => setFilters(prev => ({ ...prev, priorExperienceRequired: "yes" }))}
                />
                <PillCheckbox
                  label="Not Required"
                  checked={filters.priorExperienceRequired === "no"}
                  onChange={() => setFilters(prev => ({ ...prev, priorExperienceRequired: "no" }))}
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Duration */}
        <FilterSection title="Duration" icon={Calendar}>
          <div className="flex flex-wrap gap-2">
            {durations.map(duration => (
              <PillCheckbox
                key={duration.value}
                label={duration.label}
                checked={filters.durations.includes(duration.value)}
                onChange={() => toggleArrayFilter("durations", duration.value)}
              />
            ))}
          </div>
        </FilterSection>
      </CardContent>
    </Card>
  );
};

export default EnhancedFiltersPanel;