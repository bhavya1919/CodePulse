import { Link, useRouterState } from "@tanstack/react-router";
import {
  Shield,
  Activity,
  User,
  Search,
  Bell,
  Clock,
  Lock,
  Radio,
  Settings,
  LogOut,
  ChevronDown,
  Mail,
  ShieldCheck as ShieldIcon,
  Eye,
  Globe,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const links = [
  { to: "/interview", label: "Candidate" },
  { to: "/dashboard", label: "Recruiter" },
  { to: "/replay", label: "Replay" },
];

export function Navbar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { userSession, userName, userEmail, logout } = useAuth();
  const [secs, setSecs] = useState(18 * 60 + 42);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userSession === "candidate") {
      const t = setInterval(() => setSecs((s) => s + 1), 1000);
      return () => clearInterval(t);
    }
  }, [userSession]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  const ProfileDropdown = () => (
    <AnimatePresence>
      {showProfileMenu && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute right-0 top-full mt-2 w-52 origin-top-right rounded-2xl border border-white/10 bg-[#121214] p-2 shadow-2xl backdrop-blur-xl z-50"
        >
          <div className="mb-2 px-3 py-2 border-b border-white/5">
            <div className="text-xs font-bold text-foreground">Account Intelligence</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-tighter">
              Session Active
            </div>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                setShowProfileMenu(false);
                setShowProfileDialog(true);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground group"
            >
              <User className="h-4 w-4 group-hover:text-primary" />
              My Profile
            </button>
            <button
              onClick={() => {
                setShowProfileMenu(false);
                setShowSettingsDialog(true);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground group"
            >
              <Settings className="h-4 w-4 group-hover:text-accent" />
              Settings
            </button>
            <div className="my-1 h-px bg-white/5" />
            <button
              onClick={() => {
                setShowProfileMenu(false);
                logout();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-danger transition-all hover:bg-danger/10 group"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              Logout Session
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto mt-4 max-w-[1600px] px-4">
        <div className="glass flex items-center justify-between rounded-2xl px-4 py-3 shadow-glow">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div
              className="relative grid h-9 w-9 place-items-center rounded-xl"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Shield className="h-5 w-5 text-primary-foreground" />
              <span className="absolute inset-0 rounded-xl shadow-glow" />
            </div>
            <div className="hidden leading-tight md:block">
              <div className="text-sm font-bold tracking-tight">Technical Integrity Guard</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
                Behavioral Engineering Intelligence
              </div>
            </div>
          </Link>

          {/* Center Navigation */}
          {userSession !== "unauthenticated" && (
            <nav className="hidden items-center gap-1 lg:flex mx-4">
              {(userSession === "candidate"
                ? [
                    { to: "/interview", label: "Code" },
                    { to: "/replay", label: "Replay" },
                  ]
                : [
                    { to: "/dashboard", label: "Intelligence" },
                    { to: "/replay", label: "Replay" },
                  ]
              ).map((l) => {
                const active = path === l.to;
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`rounded-lg px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all ${
                      active
                        ? "bg-primary/10 text-primary shadow-glow-primary/5 border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {userSession === "unauthenticated" && (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-1.5 text-sm font-medium transition-colors hover:bg-secondary text-foreground border border-border/50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg px-4 py-1.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  Register
                </Link>
              </div>
            )}

            {userSession === "candidate" && (
              <div className="flex items-center gap-4">
                <div className="hidden items-center gap-4 border-r border-border/40 pr-4 lg:flex">
                  <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-[11px] font-medium text-success border border-success/20">
                    <Radio className="h-3 w-3 animate-pulse" />
                    Behavioral telemetry active
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Lock className="h-3 w-3 text-primary/70" />
                    Encrypted Session
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60 italic font-medium">
                    No video or screen capture enabled
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-xl bg-secondary/60 px-3 py-1.5 font-mono text-sm font-bold border border-border/40 shadow-sm">
                    <Clock className="h-4 w-4 text-primary" /> {mm}:{ss}
                  </div>
                  <div
                    className="flex items-center gap-2 pl-2 border-l border-border/40 relative"
                    ref={menuRef}
                  >
                    <div className="text-right hidden sm:block">
                      <div className="text-[11px] font-bold leading-none">
                        {userName || "Candidate"}
                      </div>
                      <div className="text-[9px] text-muted-foreground uppercase tracking-tighter">
                        {userSession}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className={`relative grid h-9 w-9 place-items-center rounded-full transition-all hover:scale-105 active:scale-95 group ${showProfileMenu ? "ring-2 ring-primary/50" : ""}`}
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      <User className="h-4.5 w-4.5 text-primary-foreground" />
                      <span className="absolute inset-0 rounded-full shadow-glow opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <ProfileDropdown />
                  </div>
                </div>
              </div>
            )}

            {userSession === "recruiter" && (
              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-3 py-1.5 text-xs text-muted-foreground lg:flex focus-within:border-primary/50 transition-colors">
                  <Search className="h-3.5 w-3.5" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent outline-none w-32 placeholder:text-muted-foreground/50"
                  />
                </div>

                <div className="flex items-center gap-2 border-r border-border/40 pr-3 mr-1">
                  <button className="relative grid h-9 w-9 place-items-center rounded-xl border border-border/60 bg-background/40 hover:bg-secondary/60 transition-colors">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary shadow-glow border-2 border-background" />
                  </button>
                </div>

                <div className="flex items-center gap-3 relative" ref={menuRef}>
                  <div className="text-right hidden sm:block">
                    <div className="text-[11px] font-bold leading-none">
                      {userName || "Recruiter Pro"}
                    </div>
                    <div className="text-[9px] text-muted-foreground uppercase tracking-tighter">
                      Enterprise
                    </div>
                  </div>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className={`relative grid h-9 w-9 place-items-center rounded-full transition-all hover:scale-105 active:scale-95 group ${showProfileMenu ? "ring-2 ring-primary/50" : ""}`}
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <User className="h-4.5 w-4.5 text-primary-foreground" />
                    <span className="absolute inset-0 rounded-full shadow-glow opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <ProfileDropdown />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="glass-strong border-white/10 rounded-3xl overflow-hidden p-0 max-w-md">
          <div className="h-2 w-full" style={{ background: "var(--gradient-primary)" }} />
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-bold">Candidate Identity Signature</DialogTitle>
            <DialogDescription className="text-xs uppercase tracking-widest text-muted-foreground/60">
              Verified behavioral profile
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-0 space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div
                className="h-16 w-16 rounded-2xl grid place-items-center text-primary-foreground shadow-glow"
                style={{ background: "var(--gradient-primary)" }}
              >
                <User className="h-8 w-8" />
              </div>
              <div>
                <div className="text-lg font-bold">{userName || "Candidate User"}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" /> {userEmail || "not set"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/2 border border-white/5">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                  Access Level
                </div>
                <div className="text-sm font-bold text-accent">Standard Beta</div>
              </div>
              <div className="p-3 rounded-xl bg-white/2 border border-white/5">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                  Role Signature
                </div>
                <div className="text-sm font-bold text-primary capitalize">{userSession}</div>
              </div>
            </div>

            <Button
              className="w-full h-11 rounded-xl font-bold"
              variant="outline"
              onClick={() => {
                setShowProfileDialog(false);
                toast.success("Profile optimization sequence initiated.");
              }}
            >
              Update Credentials
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="glass-strong border-white/10 rounded-3xl overflow-hidden p-0 max-w-md">
          <div className="h-2 w-full bg-accent" />
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-bold">System Optimization</DialogTitle>
            <DialogDescription className="text-xs uppercase tracking-widest text-muted-foreground/60">
              Configure your intelligence environment
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-0 space-y-4">
            {[
              {
                icon: Bell,
                label: "Behavioral Notifications",
                desc: "Alerts for anomaly detection",
              },
              { icon: Eye, label: "Interface Theme", desc: "Adaptive dark mode active" },
              { icon: Globe, label: "Institutional Sync", desc: "Global cohort data alignment" },
              { icon: ShieldIcon, label: "Telemetry Privacy", desc: "Maximum encryption enabled" },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/2 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white/5 grid place-items-center text-muted-foreground">
                    <s.icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">{s.label}</div>
                    <div className="text-[10px] text-muted-foreground">{s.desc}</div>
                  </div>
                </div>
                <div className="h-5 w-9 rounded-full bg-primary/20 border border-primary/30 relative cursor-pointer group">
                  <div className="absolute right-0.5 top-0.5 h-3.5 w-3.5 rounded-full bg-primary shadow-glow transition-all" />
                </div>
              </div>
            ))}

            <Button
              className="w-full h-11 rounded-xl font-bold mt-2"
              style={{ background: "var(--gradient-primary)" }}
              onClick={() => {
                setShowSettingsDialog(false);
                toast.success("Intelligence parameters persistent.");
              }}
            >
              Persist Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
