import { Card, CardContent } from "@/components/ui/card";
import { Clock, Target, Shield, Zap } from "lucide-react";

const WhySection = () => {
  const reasons = [
    {
      icon: <Clock className="h-8 w-8 text-secondary" />,
      title: "Save Time",
      description: "Stop emailing dozens of PIs individually. Find and apply to opportunities in minutes, not weeks."
    },
    {
      icon: <Target className="h-8 w-8 text-secondary" />,
      title: "Better Matches",
      description: "Our smart matching connects you with roles that fit your skills, schedule, and career goals."
    },
    {
      icon: <Shield className="h-8 w-8 text-secondary" />,
      title: "Verified Training",
      description: "Showcase your CITI, HIPAA, and BBP certifications. Stand out with verified badges."
    },
    {
      icon: <Zap className="h-8 w-8 text-secondary" />,
      title: "Direct Communication",
      description: "Message PIs and coordinators directly. Schedule interviews without the back-and-forth."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Why MedBridge Exists
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pre-med is competitive and confusing. We're here to make finding research experience, 
            clinical opportunities, and mentorship clear, accessible, and professional.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4">{reason.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
                <p className="text-muted-foreground">{reason.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
