import { CheckCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const PathwaySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate steps sequentially
            [0, 1, 2, 3, 4].forEach((index) => {
              setTimeout(() => {
                setActiveStep(index);
              }, index * 300);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: "01",
      title: "Build Your Identity",
      description: "Create a verified profile with certifications, education, and experience"
    },
    {
      number: "02",
      title: "Get Verified",
      description: "Upload training certificates and earn digital badges"
    },
    {
      number: "03",
      title: "Find Opportunities",
      description: "Browse curated research, clinical, and volunteer positions"
    },
    {
      number: "04",
      title: "Log Hours",
      description: "Track and verify all clinical, research, and volunteer experiences"
    },
    {
      number: "05",
      title: "Apply with Confidence",
      description: "Stand out with a complete, verified pre-med portfolio"
    }
  ];

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(24,166,166,0.05),transparent_50%)]" />

      <div className="container relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm">
            <CheckCircle className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Your Journey</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground mb-6">
            The Pathway to
            <span className="block mt-2 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Medical Excellence
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A clear, structured path from aspiring student to confident medical school applicant
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 hidden lg:block" />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative transition-all duration-700 ${
                  activeStep >= index 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                {/* Step card */}
                <div className="relative group">
                  {/* Glow effect */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-accent to-primary rounded-2xl opacity-0 blur transition-all duration-500 ${
                    activeStep >= index ? 'opacity-20 group-hover:opacity-40' : ''
                  }`} />
                  
                  <div className="relative bg-card border border-border/50 rounded-2xl p-6 hover:border-accent/30 transition-all duration-300 hover:-translate-y-2 shadow-premium">
                    {/* Number badge */}
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 transition-all duration-500 ${
                      activeStep >= index 
                        ? 'bg-accent text-accent-foreground scale-100' 
                        : 'bg-muted text-muted-foreground scale-95'
                    }`}>
                      <span className="text-lg font-bold">{step.number}</span>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>

                    {/* Checkmark indicator */}
                    {activeStep >= index && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center animate-scale-in">
                        <CheckCircle className="h-4 w-4 text-accent-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Connection dot for desktop */}
                  <div className={`hidden lg:block absolute top-1/2 -right-6 w-3 h-3 rounded-full border-2 -translate-y-1/2 transition-all duration-500 ${
                    activeStep >= index 
                      ? 'bg-accent border-accent shadow-glow' 
                      : 'bg-background border-border'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PathwaySection;
