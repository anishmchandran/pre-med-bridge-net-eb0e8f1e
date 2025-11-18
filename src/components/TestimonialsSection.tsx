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
    <section className="py-20 bg-primary/5">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            What Our Community Says
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students and labs building the future of medicine
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <Avatar className="bg-secondary text-secondary-foreground">
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
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
