import { Shield, Zap, Users, TrendingUp, Target } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const WhySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const problems = [
    {
      icon: Shield,
      title: "Fragmented Credentials",
      problem: "Students struggle to organize and verify their certifications",
      solution: "Centralized, verified credential management with digital badges"
    },
    {
      icon: Users,
      title: "Hidden Opportunities",
      problem: "Research positions spread across disconnected platforms",
      solution: "Curated, verified opportunities in one trusted network"
    },
    {
      icon: TrendingUp,
      title: "Unverified Hours",
      problem: "No standardized way to track and prove clinical experience",
      solution: "Built-in verification system with supervisor confirmation"
    },
    {
      icon: Zap,
      title: "Inefficient Matching",
      problem: "Labs waste time reviewing unqualified candidates",
      solution: "Smart filtering ensures only qualified students apply"
    }
  ];

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm">
            <Target className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">The Problem We Solve</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground mb-6">
            Healthcare Education
            <span className="block mt-2 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Reimagined
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Traditional pathways are broken. MedBridge bridges the gap between aspiration and opportunity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {problems.map((item, index) => (
            <div
              key={index}
              className={`group transition-all duration-700 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative h-full">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-primary/20 rounded-2xl opacity-0 blur transition-all duration-500 group-hover:opacity-100" />
                
                {/* Card */}
                <div className="relative bg-card border border-border/50 rounded-2xl p-8 hover:border-accent/30 transition-all duration-300 shadow-premium group-hover:shadow-premium-lg group-hover:-translate-y-2 h-full">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 group-hover:bg-accent/20 group-hover:border-accent/40 transition-all duration-300 mb-6">
                    <item.icon className="h-7 w-7 text-accent" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-semibold text-foreground mb-4 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>

                  {/* Problem */}
                  <div className="mb-4 pb-4 border-b border-border/50">
                    <p className="text-sm font-medium text-muted-foreground mb-2">The Problem</p>
                    <p className="text-foreground/80">{item.problem}</p>
                  </div>

                  {/* Solution */}
                  <div>
                    <p className="text-sm font-medium text-accent mb-2">Our Solution</p>
                    <p className="text-foreground font-medium">{item.solution}</p>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-accent/10 to-transparent rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
