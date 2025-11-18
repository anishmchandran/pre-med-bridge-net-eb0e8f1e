import { UserCheck, Award, Clock, Search, Briefcase, BarChart3, Zap } from "lucide-react";
import { useState } from "react";

const FeaturesGrid = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const features = [
    {
      icon: UserCheck,
      title: "Verified Profiles",
      description: "Build trust with verified training certificates and digital badges that make you stand out",
      gradient: "from-accent/20 to-primary/20"
    },
    {
      icon: Award,
      title: "Certification Tracking",
      description: "Upload, verify, and track all your training certifications in one secure location",
      gradient: "from-primary/20 to-accent-light/20"
    },
    {
      icon: Clock,
      title: "Hour Logging",
      description: "Document clinical, research, and volunteer hours with built-in verification workflows",
      gradient: "from-accent-light/20 to-accent/20"
    },
    {
      icon: Search,
      title: "Smart Matching",
      description: "AI-powered opportunity recommendations based on your skills, interests, and certifications",
      gradient: "from-primary/20 to-primary-light/20"
    },
    {
      icon: Briefcase,
      title: "Lab Connections",
      description: "Direct messaging with PIs and research coordinators for seamless collaboration",
      gradient: "from-accent/20 to-primary-light/20"
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Visualize your pre-med journey with detailed analytics and milestone tracking",
      gradient: "from-primary-light/20 to-accent-light/20"
    }
  ];

  return (
    <section className="py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/30" />
      
      <div className="container relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Powerful Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground mb-6">
            Everything You Need to
            <span className="block mt-2 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Build Your Medical Future
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamlined tools designed specifically for pre-med students and research institutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Animated gradient border */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 blur transition-all duration-500 group-hover:opacity-100`} />
              
              {/* Card */}
              <div className="relative bg-card border border-border/50 rounded-2xl p-8 hover:border-accent/30 transition-all duration-300 shadow-premium group-hover:shadow-premium-lg group-hover:-translate-y-2 h-full">
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} transition-all duration-300 ${
                    hoveredIndex === index ? 'scale-110 rotate-3' : 'scale-100 rotate-0'
                  }`}>
                    <feature.icon className="h-8 w-8 text-accent" />
                  </div>
                  
                  {/* Pulse effect on hover */}
                  {hoveredIndex === index && (
                    <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-accent/20 animate-ping" />
                  )}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative element */}
                <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl ${feature.gradient} opacity-0 rounded-tl-full transition-opacity duration-500 group-hover:opacity-30`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
