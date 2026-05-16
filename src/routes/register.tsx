import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Shield,
  Mail,
  Lock,
  User,
  Chrome,
  Linkedin,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Bot,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User as UserIcon, Briefcase } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Enterprise Registration · Technical Integrity Guard" }] }),
  component: RegisterPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

type UserSession = "unauthenticated" | "candidate" | "recruiter";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<UserSession>("candidate");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await register(email, password, name, role);

    if (result.success) {
      toast.success("Registration successful. Please check your email to verify or proceed to login.");
      setTimeout(() => {
        navigate({ to: "/login" });
      }, 2000);
    } else {
      setError(result.error || "Registration failed. Please check your inputs.");
      toast.error("Registration failed.");
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (platform: string) => {
    toast.info(`${platform} institutional sync is being optimized for global engineering cohorts.`);
  };

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12 bg-[#0A0A0B]">
      {/* background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute right-[20%] bottom-[20%] h-[300px] w-[300px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-[900px] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Branding */}
        <motion.div {...fadeUp} className="hidden md:block space-y-8">
          <div>
            <div className="h-12 w-12 rounded-2xl bg-accent/20 grid place-items-center text-accent mb-6 shadow-glow-accent/20">
              <Shield className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
              Build your <br />
              <span className="text-gradient">Intelligence Stack.</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Join 500+ enterprise teams using behavioral engineering to identify top-tier cognitive
              talent.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: Bot,
                title: "AI-Behavioral Support",
                desc: "Non-invasive cognitive bridges for elite problem solving.",
              },
              {
                icon: ShieldCheck,
                title: "Fairness Audited",
                desc: "Built with explainability and privacy at the core.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5"
              >
                <div className="h-10 w-10 rounded-xl bg-white/5 grid place-items-center text-accent shrink-0">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">{f.title}</div>
                  <div className="text-[11px] text-muted-foreground">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Register Form */}
        <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
          <Card className="glass-strong border-white/10 shadow-2xl overflow-hidden rounded-3xl">
            <div className="h-1.5 w-full" style={{ background: "var(--gradient-primary)" }} />
            <CardHeader className="space-y-1 text-center pt-8">
              <CardTitle className="text-2xl font-bold tracking-tight">Request Access</CardTitle>
              <CardDescription className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
                {role === "candidate" ? "Candidate Signature Setup" : "Recruiter Intelligence Hub"}
              </CardDescription>
            </CardHeader>

            <div className="px-6 pb-2">
              <Tabs
                defaultValue="candidate"
                onValueChange={(v) => setRole(v as UserSession)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-xl">
                  <TabsTrigger
                    value="candidate"
                    className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                  >
                    <UserIcon className="h-3.5 w-3.5" /> Candidate
                  </TabsTrigger>
                  <TabsTrigger
                    value="recruiter"
                    className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                  >
                    <Briefcase className="h-3.5 w-3.5" /> Recruiter
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-xl bg-danger/10 p-3 text-xs text-danger border border-danger/20 text-center font-medium"
                  >
                    {error}
                  </motion.div>
                )}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1"
                  >
                    Full Identification
                  </Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      id="name"
                      placeholder="Enterprise Architect"
                      className="pl-11 h-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary/40 focus:border-primary/50 transition-all"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1"
                  >
                    Work Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      id="email"
                      placeholder="name@company.com"
                      className="pl-11 h-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary/40 focus:border-primary/50 transition-all"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1"
                  >
                    Secure Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="pl-11 pr-10 h-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary/40 focus:border-primary/50 transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-muted-foreground/50 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl text-primary-foreground text-sm font-bold shadow-glow hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Provisioning...
                    </>
                  ) : (
                    <>
                      Create Infrastructure <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                    <span className="bg-[#121214] px-4 text-muted-foreground/60">
                      Institutional Sync
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-xs h-10 rounded-xl font-bold"
                    type="button"
                    onClick={() => handleSocialLogin("Google")}
                  >
                    <Chrome className="mr-2 h-4 w-4 text-primary" /> Google
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-xs h-10 rounded-xl font-bold"
                    type="button"
                    onClick={() => handleSocialLogin("LinkedIn")}
                  >
                    <Linkedin className="mr-2 h-4 w-4 text-accent" /> LinkedIn
                  </Button>
                </div>
              </CardContent>
            </form>
            <CardFooter className="flex flex-col space-y-4 border-t border-white/5 mt-4 py-6 bg-white/[0.01]">
              <div className="text-center text-xs font-medium text-muted-foreground w-full">
                Already registered?{" "}
                <Link to="/login" className="font-bold text-primary hover:underline">
                  Authenticate here
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
