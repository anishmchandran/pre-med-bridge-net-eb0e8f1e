import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Calendar, 
  Award, 
  Briefcase, 
  Users, 
  MessageSquare,
  Filter,
  BarChart
} from "lucide-react";

const FeaturesGrid = () => {
  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Professional Profiles",
      description: "LinkedIn-style profiles tailored for pre-med students"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Training Badges",
      description: "Verify CITI, HIPAA, and BBP certifications"
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Availability Tracking",
      description: "Share your weekly schedule with potential labs"
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Opportunity Postings",
      description: "Research, clinical, and shadowing roles in one place"
    },
    {
      icon: <Filter className="h-6 w-6" />,
      title: "Smart Filtering",
      description: "Find roles by field, location, paid vs. volunteer"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Matching System",
      description: "Get matched with labs based on your skills"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Direct Messaging",
      description: "Chat with PIs and coordinators in real-time"
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Hour Tracking",
      description: "Log your research and clinical hours"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight">
            Everything You Need
            <span className="block mt-2 text-accent">in One Platform</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Built specifically for pre-med students and research opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group border-border/50 hover:border-accent/30 hover:shadow-premium transition-all duration-300">
              <CardContent className="pt-8 pb-6 px-6">
                <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-all">
                  {React.cloneElement(feature.icon, { className: "h-6 w-6 text-accent" })}
                </div>
                <h3 className="font-semibold mb-2.5 text-base group-hover:text-accent transition-colors">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
