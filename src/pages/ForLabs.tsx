import Navigation from "@/components/Navigation";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Shield, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const ForLabs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Qualified Research Assistants
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with verified, trained students ready to contribute to your research. 
              Streamline recruitment and ensure compliance with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/pi-profile/create">Create PI Profile</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Research Teams Choose MedBridge
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Target className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Pre-Verified Students</CardTitle>
                <CardDescription>
                  All candidates have verified training badges (CITI, HIPAA) before they apply
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Post in Minutes</CardTitle>
                <CardDescription>
                  Simple posting process - create a role in under 3 minutes and reach qualified applicants
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Centralized Applicant Management</CardTitle>
                <CardDescription>
                  Review all applicants in one place with skills match percentage and verification status
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Compliance Made Easy</CardTitle>
                <CardDescription>
                  Download certificates, export compliance reports, and maintain institutional records
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Built-in Messaging</CardTitle>
                <CardDescription>
                  Communicate directly with candidates, schedule interviews, and share meeting links
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Institutional Verification</CardTitle>
                <CardDescription>
                  Your lab profile is verified within 24 hours, building trust with applicants
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex gap-6 items-start">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Create Your PI Profile</h3>
                <p className="text-muted-foreground">
                  Establish your verified identity as a Principal Investigator with institutional affiliation, 
                  research focus, and publications. Get verified within 24 hours.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Set Up Your Lab Profile</h3>
                <p className="text-muted-foreground">
                  Create your lab profile with team information, department, research areas, and contact details. 
                  Connect it to your verified PI profile.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Post Opportunities</h3>
                <p className="text-muted-foreground">
                  Create detailed role postings with requirements, compensation, duration, and required certifications. 
                  Opportunities go live after a quick review.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Review & Hire</h3>
                <p className="text-muted-foreground">
                  Filter candidates by skills match, view verified training badges, message directly, 
                  and onboard qualified research assistants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">70%</div>
              <p className="text-muted-foreground">Roles filled within 30 days</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">&lt;3min</div>
              <p className="text-muted-foreground">Average time to post opportunity</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">80%</div>
              <p className="text-muted-foreground">Applicants pre-verified</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Build Your Research Team?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join leading research labs using MedBridge to find exceptional student talent.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/pi-profile/create">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForLabs;
