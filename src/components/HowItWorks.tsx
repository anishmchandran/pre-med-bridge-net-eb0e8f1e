import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserPlus, Search, MessageSquare, BarChart3, Users, Briefcase, Award, Clock, CheckCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: <UserPlus className="h-8 w-8 text-secondary" />,
      title: "Create Your Profile",
      description: "Upload your training badges, resume, and interests. Verified profiles stand out."
    },
    {
      number: "02",
      icon: <Search className="h-8 w-8 text-secondary" />,
      title: "Find or Post Opportunities",
      description: "Students browse roles that match their certifications. Labs post open positions."
    },
    {
      number: "03",
      icon: <MessageSquare className="h-8 w-8 text-secondary" />,
      title: "Apply, Connect, and Communicate",
      description: "Message directly through MedBridge and track your applications in one dashboard."
    },
    {
      number: "04",
      icon: <BarChart3 className="h-8 w-8 text-secondary" />,
      title: "Track and Grow",
      description: "Log verified hours and build your experience portfolio for medical school."
    }
  ];

  const studentBenefits = [
    { icon: <Award className="h-6 w-6 text-secondary" />, text: "Build a verified pre-med profile" },
    { icon: <Search className="h-6 w-6 text-secondary" />, text: "Access real opportunities" },
    { icon: <BarChart3 className="h-6 w-6 text-secondary" />, text: "Get mentor feedback and track your progress" }
  ];

  const labBenefits = [
    { icon: <Users className="h-6 w-6 text-secondary" />, text: "Recruit pre-trained, compliant undergrads" },
    { icon: <Clock className="h-6 w-6 text-secondary" />, text: "Simplify onboarding" },
    { icon: <Briefcase className="h-6 w-6 text-secondary" />, text: "Promote research impact through mentorship" }
  ];

  const testimonials = [
    {
      quote: "MedBridge connected me with a neuroscience lab that perfectly matched my interests. The verified badge system made my application stand out.",
      author: "Sarah Chen",
      role: "Pre-Med Student, UCLA"
    },
    {
      quote: "We found three qualified research assistants in under a week. The certification verification saved us hours of compliance work.",
      author: "Dr. Michael Rodriguez",
      role: "PI, Johns Hopkins Medicine"
    }
  ];

  const faqs = [
    {
      question: "How are certifications verified?",
      answer: "We use OCR technology and manual verification to confirm your training certificates. Once verified, you'll receive a digital badge that appears on your profile."
    },
    {
      question: "Is there a cost to join?",
      answer: "MedBridge is free for students. Labs and research institutions have access to free basic features with optional premium tools."
    },
    {
      question: "Can I track volunteer hours?",
      answer: "Yes! Our hour logging system allows you to record and verify all your clinical, research, and volunteer experiences in one place."
    },
    {
      question: "What if my certification expires?",
      answer: "We'll send you reminders 30 days before expiration. You can upload renewed certificates at any time to maintain your verified status."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              How MedBridge Connects Future Physicians with Real Opportunities
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              In one platform, students discover research, clinical, and volunteer experiences — and labs find qualified, trained assistants ready to contribute.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-secondary hover:bg-secondary-dark text-secondary-foreground">
                <Link to="/auth">Get Started – Students</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/for-labs">Join as a Lab</Link>
              </Button>
            </div>
          </div>

          {/* Flow Diagram */}
          <div className="flex items-center justify-center gap-4 flex-wrap max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm font-medium">
              <UserPlus className="h-5 w-5 text-secondary" />
              <span>Student</span>
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle className="h-5 w-5 text-secondary" />
              <span>MedBridge</span>
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Briefcase className="h-5 w-5 text-secondary" />
              <span>Lab</span>
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Award className="h-5 w-5 text-secondary" />
              <span>Experience</span>
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <BarChart3 className="h-5 w-5 text-secondary" />
              <span>Verified Hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Four Simple Steps
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From profile creation to verified experience tracking
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <Card key={index} className="relative border-border hover:border-secondary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="absolute -top-4 left-6 bg-secondary text-secondary-foreground font-bold text-sm px-3 py-1 rounded-full">
                    {step.number}
                  </div>
                  <div className="mb-4 mt-2">{step.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Students / For Labs Split */}
      <section className="py-20 bg-muted/20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-6">For Students</h3>
              <div className="space-y-4">
                {studentBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {benefit.icon}
                    <p className="text-muted-foreground">{benefit.text}</p>
                  </div>
                ))}
              </div>
              <Button asChild className="mt-6 bg-secondary hover:bg-secondary-dark text-secondary-foreground">
                <Link to="/auth">Create Student Profile</Link>
              </Button>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-primary mb-6">For Labs</h3>
              <div className="space-y-4">
                {labBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {benefit.icon}
                    <p className="text-muted-foreground">{benefit.text}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" asChild className="mt-6">
                <Link to="/for-labs">Create Lab Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
            Success Stories
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/20">
        <div className="container max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-light">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
              Start Building Your Path Into Medicine
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join thousands of students and labs already connected through MedBridge
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-secondary hover:bg-secondary-dark text-secondary-foreground">
                <Link to="/auth">Sign Up as a Student</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild
                className="bg-background/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-background/20"
              >
                <Link to="/for-labs">Create a Lab Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
