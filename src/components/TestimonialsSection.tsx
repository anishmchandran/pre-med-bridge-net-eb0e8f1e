import { Quote, MessageSquare } from "lucide-react";
import { useState } from "react";

const TestimonialsSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const testimonials = [
    {
      quote: "MedBridge connected me with a neuroscience lab that perfectly matched my interests. The verified badge system made my application stand out.",
      author: "Sarah Chen",
      role: "Pre-Med Student",
      institution: "UCLA",
      gradient: "from-accent/10 to-primary/10"
    },
    {
      quote: "We found three qualified research assistants in under a week. The certification verification saved us hours of compliance work.",
      author: "Dr. Michael Rodriguez",
      role: "Principal Investigator",
      institution: "Johns Hopkins Medicine",
      gradient: "from-primary/10 to-accent-light/10"
    },
    {
      quote: "The hour logging feature made it incredibly easy to document all my clinical experiences. Medical schools were impressed with my organized portfolio.",
      author: "James Park",
      role: "Medical Student",
      institution: "Stanford Medicine",
      gradient: "from-accent-light/10 to-accent/10"
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(24,166,166,0.08),transparent_50%)]" />
      
      <div className="container relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm">
            <MessageSquare className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Success Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground mb-6">
            Trusted by Students and
            <span className="block mt-2 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Research Leaders
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real stories from the MedBridge community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Animated gradient glow */}
              <div className={`absolute -inset-0.5 bg-gradient-to-br ${testimonial.gradient} rounded-2xl opacity-0 blur-lg transition-all duration-500 ${
                hoveredIndex === index ? 'opacity-100' : ''
              }`} />
              
              {/* Card */}
              <div className="relative bg-card border border-border/50 rounded-2xl p-8 hover:border-accent/30 transition-all duration-300 shadow-premium group-hover:shadow-premium-lg group-hover:-translate-y-2 h-full flex flex-col">
                {/* Quote icon */}
                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${testimonial.gradient} transition-transform duration-300 ${
                    hoveredIndex === index ? 'scale-110 rotate-6' : 'scale-100'
                  }`}>
                    <Quote className="h-6 w-6 text-accent" />
                  </div>
                </div>

                {/* Quote text */}
                <blockquote className="text-foreground leading-relaxed mb-6 flex-grow">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author info */}
                <div className="border-t border-border/50 pt-6">
                  <div className="flex items-center gap-3">
                    {/* Avatar placeholder */}
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center`}>
                      <span className="text-accent font-semibold text-lg">
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    <div>
                      <p className="font-semibold text-foreground">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-accent">
                        {testimonial.institution}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
