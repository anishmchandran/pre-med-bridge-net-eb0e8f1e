import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, X, MapPin, Clock, GraduationCap, FlaskConical, Laptop, Calendar, Filter } from "lucide-react";
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
  defaultOpen = false 
}: { 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 px-4 hover:bg-accent/50 rounded-lg transition-colors group">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">{title}</span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 pt-2 space-y-3 animate-in slide-in-from-top-2 duration-200">
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
      "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
      "border hover:scale-105 active:scale-95",
      checked 
        ? "bg-primary text-primary-foreground border-primary shadow-sm" 
        : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-accent"
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
    <Card className="sticky top-4 overflow-hidden border-border/50 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-background to-accent/20">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <span className="font-semibold">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <CardContent className="p-0 divide-y divide-border/50">
        {/* Location */}
        <FilterSection title="Location" icon={MapPin} defaultOpen>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">City</Label>
              <Input
                placeholder="Any city"
                value={filters.city}
                onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                className="h-9 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">State</Label>
              <Input
                placeholder="Any state"
                value={filters.state}
                onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                className="h-9 text-sm"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Within {filters.radiusMiles} miles</Label>
            <Slider
              value={[filters.radiusMiles]}
              onValueChange={([value]) => setFilters(prev => ({ ...prev, radiusMiles: value }))}
              max={200}
              min={5}
              step={5}
              className="mt-2"
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
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={40}
                value={filters.minHoursPerWeek}
                onChange={(e) => setFilters(prev => ({ ...prev, minHoursPerWeek: Number(e.target.value) }))}
                className="h-9 w-20 text-sm"
              />
              <span className="text-sm text-muted-foreground">to</span>
              <Input
                type="number"
                min={0}
                max={40}
                value={filters.maxHoursPerWeek}
                onChange={(e) => setFilters(prev => ({ ...prev, maxHoursPerWeek: Number(e.target.value) }))}
                className="h-9 w-20 text-sm"
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
          <div className="space-y-3">
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
