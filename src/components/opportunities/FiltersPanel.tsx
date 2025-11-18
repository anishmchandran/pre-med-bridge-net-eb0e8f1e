import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FiltersPanelProps {
  filters: {
    category: string;
    isPaid: string;
    isRemote: string;
    certifications: string[];
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    category: string;
    isPaid: string;
    isRemote: string;
    certifications: string[];
  }>>;
}

const FiltersPanel = ({ filters, setFilters }: FiltersPanelProps) => {
  const categories = [
    { value: "research", label: "Research" },
    { value: "clinical", label: "Clinical" },
    { value: "volunteer", label: "Volunteer" },
    { value: "shadowing", label: "Shadowing" },
    { value: "data", label: "Data Science" },
  ];

  const certifications = ["CITI", "HIPAA", "BBP", "BLS", "ACLS"];

  const handleCertificationToggle = (cert: string) => {
    setFilters(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: "",
      isPaid: "",
      isRemote: "",
      certifications: [],
    });
  };

  const hasActiveFilters = 
    filters.category || 
    filters.isPaid || 
    filters.isRemote || 
    filters.certifications.length > 0;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 px-2"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Category</Label>
          <RadioGroup
            value={filters.category}
            onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
          >
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="" id="category-all" />
              <Label htmlFor="category-all" className="font-normal cursor-pointer">
                All Categories
              </Label>
            </div>
            {categories.map((cat) => (
              <div key={cat.value} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value={cat.value} id={`category-${cat.value}`} />
                <Label htmlFor={`category-${cat.value}`} className="font-normal cursor-pointer">
                  {cat.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Paid/Unpaid Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Compensation</Label>
          <RadioGroup
            value={filters.isPaid}
            onValueChange={(value) => setFilters(prev => ({ ...prev, isPaid: value }))}
          >
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="" id="paid-all" />
              <Label htmlFor="paid-all" className="font-normal cursor-pointer">
                All
              </Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="paid" id="paid-yes" />
              <Label htmlFor="paid-yes" className="font-normal cursor-pointer">
                Paid Only
              </Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="unpaid" id="paid-no" />
              <Label htmlFor="paid-no" className="font-normal cursor-pointer">
                Unpaid/Volunteer
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Location Type Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Location</Label>
          <RadioGroup
            value={filters.isRemote}
            onValueChange={(value) => setFilters(prev => ({ ...prev, isRemote: value }))}
          >
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="" id="remote-all" />
              <Label htmlFor="remote-all" className="font-normal cursor-pointer">
                All Locations
              </Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="remote" id="remote-yes" />
              <Label htmlFor="remote-yes" className="font-normal cursor-pointer">
                Remote Only
              </Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="onsite" id="remote-no" />
              <Label htmlFor="remote-no" className="font-normal cursor-pointer">
                On-site Only
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Required Certifications Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Required Training</Label>
          <div className="space-y-2">
            {certifications.map((cert) => (
              <div key={cert} className="flex items-center space-x-2">
                <Checkbox
                  id={`cert-${cert}`}
                  checked={filters.certifications.includes(cert)}
                  onCheckedChange={() => handleCertificationToggle(cert)}
                />
                <Label htmlFor={`cert-${cert}`} className="font-normal cursor-pointer">
                  {cert}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiltersPanel;
