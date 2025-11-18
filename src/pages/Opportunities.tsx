import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import OpportunityCard from "@/components/opportunities/OpportunityCard";
import FiltersPanel from "@/components/opportunities/FiltersPanel";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    isPaid: "",
    isRemote: "",
    certifications: [] as string[],
  });
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

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(opp => opp.category === filters.category);
    }

    // Paid/Unpaid filter
    if (filters.isPaid === "paid") {
      filtered = filtered.filter(opp => opp.is_paid);
    } else if (filters.isPaid === "unpaid") {
      filtered = filtered.filter(opp => !opp.is_paid);
    }

    // Remote filter
    if (filters.isRemote === "remote") {
      filtered = filtered.filter(opp => opp.is_remote);
    } else if (filters.isRemote === "onsite") {
      filtered = filtered.filter(opp => !opp.is_remote);
    }

    // Certifications filter
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Find Opportunities</h1>
          <p className="text-muted-foreground">
            Discover research, clinical, and volunteer positions tailored to your skills
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder="Search by keywords, lab name, institution..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              All Opportunities ({filteredOpportunities.length})
            </TabsTrigger>
            <TabsTrigger value="saved">
              Saved ({savedOpportunitiesList.length})
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Panel */}
            <div className="lg:col-span-1">
              <FiltersPanel filters={filters} setFilters={setFilters} />
            </div>

            {/* Results Feed */}
            <div className="lg:col-span-3">
              <TabsContent value="all" className="mt-0">
                {filteredOpportunities.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No opportunities found matching your criteria
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOpportunities.map((opportunity) => (
                      <OpportunityCard
                        key={opportunity.id}
                        opportunity={opportunity}
                        isSaved={savedOpportunities.includes(opportunity.id)}
                        onSaveToggle={() => handleSaveToggle(opportunity.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="saved" className="mt-0">
                {savedOpportunitiesList.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      You haven't saved any opportunities yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedOpportunitiesList.map((opportunity) => (
                      <OpportunityCard
                        key={opportunity.id}
                        opportunity={opportunity}
                        isSaved={true}
                        onSaveToggle={() => handleSaveToggle(opportunity.id)}
                      />
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
