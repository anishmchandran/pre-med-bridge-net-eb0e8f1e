import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GraduationCap, Microscope } from "lucide-react";

const BenefitsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Student Benefits */}
          <Card className="border-secondary/20 hover:border-secondary/50 transition-colors">
            <CardHeader>
              <div className="mb-4">
                <GraduationCap className="h-12 w-12 text-secondary" />
              </div>
              <CardTitle className="text-2xl">For Pre-Med Students</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-secondary mr-2">✓</span>
                  <span className="text-muted-foreground">Build a professional profile showcasing your skills and training</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary mr-2">✓</span>
                  <span className="text-muted-foreground">Get matched with research labs that fit your interests</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary mr-2">✓</span>
                  <span className="text-muted-foreground">Apply to multiple opportunities with one profile</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary mr-2">✓</span>
                  <span className="text-muted-foreground">Track your clinical and research hours in one place</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary mr-2">✓</span>
                  <span className="text-muted-foreground">Connect with mentors and peers on the same journey</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-secondary hover:bg-secondary-dark">
                <Link to="/signup">Create Your Profile</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Lab Benefits */}
          <Card className="border-primary/20 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="mb-4">
                <Microscope className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">For Labs & PIs</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Post opportunities and reach motivated pre-med students</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Filter candidates by skills, training, and availability</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Review applications and resumes in one organized platform</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Communicate directly with applicants through secure messaging</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Build your lab's reputation and attract top talent</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link to="/for-labs">Post an Opportunity</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
