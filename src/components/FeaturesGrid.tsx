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
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Everything You Need in One Platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built specifically for pre-med students and research opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:border-secondary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="mb-4 text-secondary">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
