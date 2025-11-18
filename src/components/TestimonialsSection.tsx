import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "MedBridge made finding research opportunities so much easier. I landed a position in a neuroscience lab within two weeks of signing up.",
      name: "Sarah Chen",
      role: "Pre-Med Student, UC Berkeley",
      initials: "SC"
    },
    {
      quote: "As a PI, this platform has transformed how we recruit research assistants. We now get qualified, trained applicants who are genuinely interested in our work.",
      name: "Dr. Michael Rodriguez",
      role: "Principal Investigator, Stanford Medicine",
      initials: "MR"
    },
    {
      quote: "The training badge feature is brilliant. I could showcase my CITI and HIPAA certifications, which helped me stand out from other applicants.",
      name: "Priya Patel",
      role: "Gap Year Student, applying to med school",
      initials: "PP"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight">
            What Our Community
            <span className="block mt-2 text-accent">Says</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join thousands of students and labs building the future of medicine
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-premium-lg transition-all duration-300 group">
              <CardContent className="pt-8 pb-6 px-6">
                <p className="text-muted-foreground mb-8 italic leading-relaxed text-[15px]">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <Avatar className="bg-accent text-accent-foreground h-12 w-12 group-hover:scale-110 transition-transform">
                    <AvatarFallback className="text-sm font-semibold">{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
