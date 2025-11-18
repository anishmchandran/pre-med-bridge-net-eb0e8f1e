import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Activity, Zap, Sparkles, Users } from "lucide-react";
import { useEffect, useRef } from "react";

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle network animation
    const particles: Array<{x: number, y: number, vx: number, vy: number, connections: number}> = [];
    const particleCount = 80;
    const connectionDistance = 150;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        connections: 0
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        particle.connections = 0;

        // Draw connections
        particles.forEach((otherParticle, j) => {
          if (i === j) return;
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            particle.connections++;
            const opacity = (1 - distance / connectionDistance) * 0.15;
            ctx.strokeStyle = `rgba(24, 166, 166, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });

        // Draw particle
        const size = Math.min(particle.connections * 0.5 + 2, 4);
        ctx.fillStyle = `rgba(24, 166, 166, ${0.6 + particle.connections * 0.1})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Futuristic Animated Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-background to-muted/30">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 opacity-60"
        />
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(24,166,166,0.08),transparent_70%)]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(24,166,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(24,166,166,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-32 md:py-40">
        <div className="max-w-5xl mx-auto text-center">
          {/* Floating badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm animate-fade-in">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">The Future of Medical Pathways</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-foreground mb-8 animate-fade-in-slow">
            Your Path to Medicine
            <span className="block mt-2 bg-gradient-to-r from-accent via-accent-light to-primary bg-clip-text text-transparent">
              Starts Here
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in font-light">
            A next-generation platform connecting future physicians to verified research, clinical opportunities, and mentorship pathways — through precision, trust, and innovation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-slide-up">
            <Button 
              size="xl" 
              variant="accent"
              asChild
              className="group"
            >
              <Link to="/auth" className="gap-3">
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              size="xl" 
              variant="outline" 
              asChild
              className="border-border/50 hover:border-accent/50 hover:bg-accent/5"
            >
              <Link to="/opportunities" className="gap-3">
                <Activity className="h-5 w-5" />
                Explore Opportunities
              </Link>
            </Button>
          </div>

          {/* Futuristic Stats Grid */}
          <div className="grid grid-cols-3 gap-8 pt-16 border-t border-border/30 max-w-4xl mx-auto">
            {[
              { icon: Activity, value: "500+", label: "Open Opportunities", delay: "0ms" },
              { icon: Users, value: "2,000+", label: "Active Students", delay: "100ms" },
              { icon: Zap, value: "100+", label: "Partner Labs", delay: "200ms" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="group hover:scale-105 transition-all duration-300"
                style={{ animationDelay: stat.delay }}
              >
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 group-hover:bg-accent/20 group-hover:border-accent/40 transition-all">
                  <stat.icon className="h-8 w-8 text-accent" />
                </div>
                <p className="text-4xl font-semibold text-foreground mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[5]" />
    </section>
  );
};

export default Hero;
