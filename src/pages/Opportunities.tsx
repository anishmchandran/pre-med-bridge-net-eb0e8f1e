import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import OpportunityCard from "@/components/opportunities/OpportunityCard";
import EnhancedFiltersPanel, { EnhancedFilters } from "@/components/opportunities/EnhancedFiltersPanel";
import { Input } from "@/components/ui/input";
import { Search, Loader2, SlidersHorizontal, Sparkles, TrendingUp, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  required_certifications: string[];
  required_skills: string[];
  preferred_skills: string[];
  is_paid: boolean;
  compensation_amount: number | null;
  location: string;
  is_remote: boolean;
  hours_per_week: number | null;
  duration_months: number | null;
  start_date: string | null;
  tags: string[];
  created_at: string;
  lab_profiles: {
    lab_name: string;
    institution: string;
  };
}

const defaultFilters: EnhancedFilters = {
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
};

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<EnhancedFilters>(defaultFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    loadOpportunities();
    loadSavedOpportunities();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [opportunities, searchQuery, filters]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const loadOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select(`
          *,
          lab_profiles (
            lab_name,
            institution
          )
        `)
        .eq("status", "active")
        .eq("verified", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error("Error loading opportunities:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from("saved_opportunities")
        .select("opportunity_id");

      if (error) throw error;
      setSavedOpportunities(data?.map(s => s.opportunity_id) || []);
    } catch (error) {
      console.error("Error loading saved opportunities:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...opportunities];

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(opp =>
        opp.title.toLowerCase().includes(query) ||
        opp.description.toLowerCase().includes(query) ||
        opp.lab_profiles.lab_name.toLowerCase().includes(query) ||
        opp.lab_profiles.institution.toLowerCase().includes(query) ||
        opp.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Location filters
    if (filters.city) {
      const cityLower = filters.city.toLowerCase();
      filtered = filtered.filter(opp => 
        opp.location.toLowerCase().includes(cityLower)
      );
    }
    if (filters.state) {
      const stateLower = filters.state.toLowerCase();
      filtered = filtered.filter(opp => 
        opp.location.toLowerCase().includes(stateLower)
      );
    }

    // Opportunity Type filters
    if (filters.opportunityTypes.length > 0) {
      filtered = filtered.filter(opp => {
        if (filters.opportunityTypes.includes("paid") && opp.is_paid) return true;
        if (filters.opportunityTypes.includes("unpaid") && !opp.is_paid) return true;
        return false;
      });
    }

    // Research Areas filter (check tags)
    if (filters.researchAreas.length > 0) {
      filtered = filtered.filter(opp =>
        filters.researchAreas.some(area =>
          opp.tags.some(tag => tag.toLowerCase().includes(area.toLowerCase())) ||
          opp.description.toLowerCase().includes(area.toLowerCase())
        )
      );
    }

    // Modality filters
    if (filters.modalities.length > 0) {
      filtered = filtered.filter(opp => {
        if (filters.modalities.includes("remote") && opp.is_remote) return true;
        if (filters.modalities.includes("in-person") && !opp.is_remote) return true;
        if (filters.modalities.includes("hybrid")) return true;
        return false;
      });
    }

    // Hours per week filter
    if (filters.minHoursPerWeek > 0 || filters.maxHoursPerWeek < 40) {
      filtered = filtered.filter(opp => {
        if (!opp.hours_per_week) return true;
        return opp.hours_per_week >= filters.minHoursPerWeek && 
               opp.hours_per_week <= filters.maxHoursPerWeek;
      });
    }

    // Duration filters
    if (filters.durations.length > 0) {
      filtered = filtered.filter(opp => {
        if (!opp.duration_months) return true;
        const months = opp.duration_months;
        if (filters.durations.includes("short-term") && months < 3) return true;
        if (filters.durations.includes("semester") && months >= 3 && months <= 5) return true;
        if (filters.durations.includes("summer") && months >= 2 && months <= 4) return true;
        if (filters.durations.includes("year") && months >= 9 && months <= 12) return true;
        if (filters.durations.includes("multi-year") && months > 12) return true;
        return false;
      });
    }

    // Category filter (legacy)
    if (filters.category) {
      filtered = filtered.filter(opp => opp.category === filters.category);
    }

    // Certifications filter (legacy)
    if (filters.certifications.length > 0) {
      filtered = filtered.filter(opp =>
        filters.certifications.every(cert =>
          opp.required_certifications.includes(cert)
        )
      );
    }

    setFilteredOpportunities(filtered);
  };

  const handleSaveToggle = async (opportunityId: string) => {
    const isSaved = savedOpportunities.includes(opportunityId);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (isSaved) {
        const { error } = await supabase
          .from("saved_opportunities")
          .delete()
          .eq("opportunity_id", opportunityId)
          .eq("user_id", user.id);

        if (error) throw error;
        setSavedOpportunities(prev => prev.filter(id => id !== opportunityId));
      } else {
        const { error } = await supabase
          .from("saved_opportunities")
          .insert([{ 
            opportunity_id: opportunityId,
            user_id: user.id
          }]);

        if (error) throw error;
        setSavedOpportunities(prev => [...prev, opportunityId]);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };

  const savedOpportunitiesList = filteredOpportunities.filter(opp =>
    savedOpportunities.includes(opp.id)
  );

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background bg-mesh">
        <Navigation />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
            <Loader2 className="h-12 w-12 animate-spin text-accent relative z-10" />
          </div>
          <p className="text-muted-foreground animate-pulse-soft">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh pointer-events-none" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <Navigation />
      
      <div className="container py-8 relative z-10">
        {/* Hero Section */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
              <Target className="h-6 w-6 text-accent" />
            </div>
            <Badge variant="outline" className="bg-accent/5 border-accent/30 text-accent animate-glow-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              {opportunities.length} Active Opportunities
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Find Your{" "}
            <span className="gradient-text">Perfect Opportunity</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover research, clinical, and volunteer positions tailored to your skills and interests
          </p>
        </div>

        {/* Search Bar with Mobile Filter Toggle */}
        <div className="flex gap-3 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg bg-accent/10">
              <Search className="text-accent h-4 w-4" />
            </div>
            <Input
              type="text"
              placeholder="Search by keywords, lab name, institution..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 h-12 glass-card border-border/50 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all duration-300"
            />
          </div>
          
          {/* Mobile Filter Button */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                className="lg:hidden relative h-12 px-4 glass-card border-border/50 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
              >
                <SlidersHorizontal className="h-5 w-5 text-accent" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center animate-scale-in">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-md p-0 overflow-y-auto glass-effect border-r border-border/50">
              <EnhancedFiltersPanel filters={filters} setFilters={setFilters} />
            </SheetContent>
          </Sheet>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8 p-1 glass-card border-border/50 animate-fade-in" style={{ animationDelay: '150ms' }}>
            <TabsTrigger 
              value="all"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-glow transition-all duration-300"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              All Opportunities ({filteredOpportunities.length})
            </TabsTrigger>
            <TabsTrigger 
              value="saved"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-glow transition-all duration-300"
            >
              Saved ({savedOpportunitiesList.length})
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Panel - Desktop */}
            <div className="hidden lg:block lg:col-span-1 animate-slide-in-left">
              <div className="sticky top-24">
                <EnhancedFiltersPanel filters={filters} setFilters={setFilters} />
              </div>
            </div>

            {/* Results Feed */}
            <div className="lg:col-span-3">
              <TabsContent value="all" className="mt-0">
                {filteredOpportunities.length === 0 ? (
                  <div className="text-center py-16 floating-card animate-fade-in">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                      <Search className="h-8 w-8 text-accent/50" />
                    </div>
                    <p className="text-lg font-medium text-foreground mb-2">
                      No opportunities found
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setFilters(defaultFilters)}
                      className="hover:bg-accent/10 hover:border-accent/50 transition-all duration-300"
                    >
                      Clear all filters
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {filteredOpportunities.map((opportunity, index) => (
                      <div 
                        key={opportunity.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <OpportunityCard
                          opportunity={opportunity}
                          isSaved={savedOpportunities.includes(opportunity.id)}
                          onSaveToggle={() => handleSaveToggle(opportunity.id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="saved" className="mt-0">
                {savedOpportunitiesList.length === 0 ? (
                  <div className="text-center py-16 floating-card animate-fade-in">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-accent/50" />
                    </div>
                    <p className="text-lg font-medium text-foreground mb-2">
                      No saved opportunities yet
                    </p>
                    <p className="text-muted-foreground">
                      Click the heart icon on any opportunity to save it for later
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {savedOpportunitiesList.map((opportunity, index) => (
                      <div 
                        key={opportunity.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <OpportunityCard
                          opportunity={opportunity}
                          isSaved={true}
                          onSaveToggle={() => handleSaveToggle(opportunity.id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Opportunities;