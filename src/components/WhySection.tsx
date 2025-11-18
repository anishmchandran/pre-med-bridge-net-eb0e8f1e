import React from "react";
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
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight">
            Why MedBridge
            <span className="block mt-2 text-accent">Exists</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Pre-med is competitive and confusing. We're here to make finding research experience, 
            clinical opportunities, and mentorship clear, accessible, and professional.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => (
            <Card key={index} className="group border-border/50 bg-card/80 backdrop-blur-sm hover:border-accent/30 hover:shadow-premium-lg transition-all duration-300">
              <CardContent className="pt-8 pb-6 px-6">
                <div className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 group-hover:bg-accent/20 transition-all">
                  {React.cloneElement(reason.icon, { className: "h-7 w-7 text-accent" })}
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">{reason.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{reason.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
