import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CheckCircle2, Sparkles, ArrowRight, Mail, Lock, User } from "lucide-react";
import logoWordmark from "@/assets/logo-wordmark.png";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Check if this is a new signup (from email confirmation)
          if (signUpSuccess) {
            toast({
              title: "Welcome to MedBridge!",
              description: "Your account has been created successfully.",
            });
          }
          // Navigate to dashboard
          setTimeout(() => {
            navigate("/dashboard");
          }, 100);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, signUpSuccess, toast]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: redirectUrl
        }
      });

      if (error) throw error;

      // If user is immediately signed in (auto-confirm enabled)
      if (data.session) {
        setSignUpSuccess(true);
        toast({
          title: "Welcome to MedBridge!",
          description: "Your account has been created successfully.",
        });
        navigate("/dashboard");
      } else if (data.user && !data.session) {
        // Email confirmation required
        setSignUpSuccess(true);
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link. Click it to complete your signup.",
        });
      }
    } catch (error: any) {
      let message = error.message;
      
      // Handle specific error cases with friendly messages
      if (error.message?.includes("already registered")) {
        message = "This email is already registered. Try signing in instead.";
      } else if (error.message?.includes("Invalid email")) {
        message = "Please enter a valid email address.";
      } else if (error.message?.includes("Password")) {
        message = "Password must be at least 6 characters long.";
      }
      
      toast({
        title: "Sign up failed",
        description: message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.session) {
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      let message = error.message;
      
      // Handle specific error cases with friendly messages
      if (error.message?.includes("Invalid login")) {
        message = "Invalid email or password. Please try again.";
      } else if (error.message?.includes("Email not confirmed")) {
        message = "Please confirm your email before signing in.";
      }
      
      toast({
        title: "Sign in failed",
        description: message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh" />
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px] pointer-events-none animate-pulse-soft" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-soft" style={{ animationDelay: '1s' }} />
      
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent/30 rounded-full animate-float" />
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-accent/40 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo and Header */}
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-premium-lg">
            <img src={logoWordmark} alt="MedBridge" className="h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome to <span className="gradient-text">MedBridge</span>
          </h1>
          <p className="text-muted-foreground">Connect with research opportunities that matter</p>
        </div>

        {/* Auth Card */}
        <div className="floating-card p-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-muted/50 rounded-xl relative z-10">
              <TabsTrigger 
                value="signin" 
                className="rounded-lg cursor-pointer data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-glow transition-all duration-300"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="rounded-lg cursor-pointer data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-glow transition-all duration-300"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-5 mt-0">
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-accent/10">
                      <Mail className="h-4 w-4 text-accent" />
                    </div>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your.email@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-12 h-12 bg-muted/30 border-border/50 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-accent/10">
                      <Lock className="h-4 w-4 text-accent" />
                    </div>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-12 h-12 bg-muted/30 border-border/50 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-accent to-accent-light hover:from-accent-hover hover:to-accent text-accent-foreground font-medium shadow-glow transition-all duration-300 group" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-5 mt-0">
              {signUpSuccess ? (
                <div className="text-center py-8 space-y-4 animate-scale-in">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 mb-2">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Check your email!</h3>
                  <p className="text-muted-foreground">
                    We've sent a confirmation link to{" "}
                    <span className="font-medium text-foreground">{email}</span>. 
                    Click the link to complete your signup.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setSignUpSuccess(false)}
                    className="mt-4 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300"
                  >
                    Back to Sign Up
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-sm font-medium">Full Name</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-accent/10">
                        <User className="h-4 w-4 text-accent" />
                      </div>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="pl-12 h-12 bg-muted/30 border-border/50 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-accent/10">
                        <Mail className="h-4 w-4 text-accent" />
                      </div>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-12 h-12 bg-muted/30 border-border/50 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Use your .edu email for the best experience
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-accent/10">
                        <Lock className="h-4 w-4 text-accent" />
                      </div>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="pl-12 h-12 bg-muted/30 border-border/50 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Must be at least 6 characters
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-accent to-accent-light hover:from-accent-hover hover:to-accent text-accent-foreground font-medium shadow-glow transition-all duration-300 group" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: '200ms' }}>
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;