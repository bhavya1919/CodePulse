/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  LayoutGrid,
  Users,
  FileText,
  ShieldAlert,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Sparkles,
  Gauge,
  GitBranch,
  Waves,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Cpu,
  Brain,
  Zap,
  Fingerprint,
  Activity,
  Info,
  Filter,
  MoreHorizontal,
  Download,
  Share2,
  Terminal,
  ShieldCheck,
  Play,
  Pause,
  Maximize2,
  LogOut,
} from "lucide-react";
import { Sparkline } from "@/components/site/Sparkline";
import { TelemetryStore, BehavioralSession } from "@/lib/telemetry-store";
import { useAuth } from "@/lib/auth-context";
import { DEMO_SCENARIOS } from "@/lib/demo-scenarios";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      {
        title: "Intelligence Hub · Code Pulse",
      },
    ],
  }),
  component: Dashboard,
});

const recruiterSidebarItems = [
  { icon: LayoutGrid, label: "Intelligence Overview", id: "overview" },
  { icon: Users, label: "Candidate Pipeline", id: "candidates" },
  { icon: Activity, label: "Live Monitoring", id: "live" },
  { icon: ShieldAlert, label: "Anomaly Flags", id: "flags" },
  { icon: FileText, label: "Behavioral Reports", id: "reports" },
  { icon: Settings, label: "Platform Settings", id: "settings" },
];

const candidateSidebarItems = [
  { icon: Fingerprint, label: "Candidate Overview", id: "signature" },
  { icon: Activity, label: "Session History", id: "overview" }, // map to overview for now
  { icon: Brain, label: "Cognitive Insights", id: "insights" },
  { icon: FileText, label: "My Reports", id: "reports" },
  { icon: Settings, label: "Preferences", id: "settings" },
];

const codingQuestions = [
  "Two Sum",
  "Reverse Linked List",
  "Valid Parentheses",
  "Merge Intervals",
  "Longest Common Prefix",
  "Word Search",
  "Container With Most Water",
  "Binary Search Tree Iterator",
  "Course Schedule",
  "Find Peak Element",
  "Permutations",
  "Rotate Image",
  "Searching in a Matrix",
  "Minimum Window Substring",
  "Design a LRU Cache",
  "Kth Largest Element in an Array",
  "Meeting Rooms II",
  "Number of Islands",
  "Clone Graph",
  "Word Ladder",
  "Course Schedule II",
  "Longest Increasing Subsequence",
  "Minimum Path Sum",
  "Decode Ways",
  "Jump Game",
  "Maximum Subarray",
  "House Robber",
  "Partition Labels",
  "Subarray Sum Equals K",
  "Top K Frequent Elements",
  "Cartesian Tree Construction",
  "Search in Rotated Sorted Array",
  "Find Duplicate Number",
  "Reorder List",
  "Course Schedule with Prerequisites",
  "Number of Connected Components",
  "Flip Binary Tree to Match Preorder",
  "Evaluate Reverse Polish Notation",
  "Implement Trie",
  "Sliding Window Maximum",
  "Unique Paths",
  "N-Queens",
  "Word Break",
  "Minimum Height Trees",
  "Binary Tree Right Side View",
  "Construct Binary Tree from Preorder",
  "Longest Palindromic Substring",
  "Search Suggestions System",
  "Palindrome Partitioning",
  "Alien Dictionary",
  "Design Phone Directory",
  "Maximal Rectangle",
  "Course Planner",
  "Real-time Streaming Frequency Counter",
];

function Dashboard() {
  const { userSession, userName, logout } = useAuth();
  const navigate = useNavigate();

  const isCandidate = userSession === "candidate";
  const sidebarItems = isCandidate ? candidateSidebarItems : recruiterSidebarItems;

  useEffect(() => {
    if (userSession === "unauthenticated") {
      navigate({ to: "/login" });
      return;
    }
    if (userSession === "candidate") {
      navigate({ to: "/interview" });
    }
  }, [userSession, navigate]);

  const [activeTab, setActiveTab] = useState(isCandidate ? "signature" : "overview");
  const [liveSession, setLiveSession] = useState<BehavioralSession | null>(null);
  const [countdown, setCountdown] = useState(18 * 60 + 42);

  useEffect(() => {
    const timer = setInterval(() => setCountdown((seconds) => Math.max(seconds - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const timerLabel = `${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(countdown % 60).padStart(2, "0")}`;
  const displayUserName = userName || liveSession?.candidateName || "Recruiter Pro";
  const candidateRole = liveSession ? "Senior Frontend Engineer" : "Candidate Profile";

  useEffect(() => {
    const handleSync = () => {
      const sess = TelemetryStore.getSession();
      if (sess) setLiveSession(sess);
    };

    window.addEventListener("storage", handleSync);

    // Initial load
    handleSync();

    // Polling as backup
    const poll = setInterval(handleSync, 2000);
    return () => {
      window.removeEventListener("storage", handleSync);
      clearInterval(poll);
    };
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-[#0A0A0B]">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-4 gap-6 bg-[#0E0E10]">
        <div className="px-3 py-2">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">
            Enterprise Intelligence
          </div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "reports" || item.id === "settings") {
                    toast.info(
                      `${item.label} module is being optimized for higher cognitive precision.`,
                    );
                  }
                  setActiveTab(item.id);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all group ${
                  activeTab === item.id
                    ? "bg-primary/10 text-primary shadow-glow-primary/10 border border-primary/20"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <item.icon
                  className={`h-4 w-4 ${activeTab === item.id ? "text-primary" : "group-hover:text-primary transition-colors"}`}
                />
                {item.label}
                {activeTab === item.id && (
                  <motion.div
                    layoutId="active-pill"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-violet-glow/10 to-transparent border border-violet-glow/20 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 h-16 w-16 bg-violet-glow/20 blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-violet-glow">
              <Zap className="h-4 w-4 fill-violet-glow" />
              <span className="text-xs font-bold uppercase tracking-widest">Enterprise Pro</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              Unlock advanced behavioral cohort analysis.
            </p>
            <button
              onClick={() =>
                toast.success("Enterprise sales team has been notified. We will reach out shortly!")
              }
              className="w-full py-1.5 rounded-lg bg-violet-glow text-white text-[10px] font-bold hover:brightness-110 transition-all"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        <div className="mb-6">
          <div className="glass-strong rounded-3xl border-white/5 p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shadow-xl">
            <div className="flex items-start gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-primary/15 via-accent/15 to-violet-glow/10 border border-white/10">
                <div className="h-11 w-11 rounded-2xl bg-[#0E0E10] grid place-items-center text-primary shadow-glow">
                  {displayUserName[0]}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-2">
                  Candidate Dashboard
                </div>
                <h2 className="text-2xl font-bold tracking-tight">{displayUserName}</h2>
                <p className="text-sm text-muted-foreground">
                  {candidateRole} · Live coding assessment in progress
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[auto_auto] sm:items-center sm:justify-end">
              <div className="rounded-3xl bg-white/5 border border-white/10 px-4 py-3 shadow-sm flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                    Countdown
                  </div>
                  <div className="text-lg font-semibold">{timerLabel}</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center justify-center gap-2 rounded-3xl bg-danger/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-danger border border-danger/20 hover:bg-danger/15 transition-all"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </div>

        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              {sidebarItems.find((i) => i.id === activeTab)?.label}
            </h1>
            <p className="text-sm text-muted-foreground">
              Monitoring <span className="text-primary font-medium">12 active</span> behavioral
              sessions across global engineering cohorts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (!liveSession) {
                  toast.error("No active session data to export.");
                  return;
                }
                const doc = new jsPDF();
                const m = liveSession.metrics;

                doc.setFont("helvetica", "bold");
                doc.setFontSize(22);
                doc.text("RECRUITER INTELLIGENCE INSIGHTS", 20, 30);

                doc.setFontSize(12);
                doc.setFont("helvetica", "normal");
                doc.text(`Candidate: ${liveSession.candidateName}`, 20, 45);
                doc.text(`Session ID: ${liveSession.id}`, 20, 52);

                doc.setFont("helvetica", "bold");
                doc.text("LIVE METRICS SUMMARY", 20, 65);
                doc.setFont("helvetica", "normal");
                doc.text(`Cognitive Confidence: ${m.continuity}%`, 25, 75);
                doc.text(`Typing Velocity: ${m.wpm} WPM`, 25, 82);
                doc.text(`Typing Rhythm: ${Math.round(m.typingRhythm || 0)}%`, 25, 89);
                doc.text(`Refactor Density: ${Math.round(m.refactorDensity || 0)}%`, 25, 96);
                doc.text(`Pause Density: ${Math.round(m.pauseDensity || 0)}%`, 25, 103);
                doc.text(`Semantic Continuity: ${Math.round(m.semanticContinuity || 0)}%`, 25, 110);

                doc.text(
                  "Detailed behavioral telemetry is available in the Replay portal.",
                  20,
                  130,
                );

                doc.save(
                  `recruiter_insights_${liveSession.candidateName.toLowerCase().replace(/\s+/g, "_")}.pdf`,
                );
                toast.success("Insights PDF exported successfully.");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium hover:bg-white/10 transition-all"
            >
              <Download className="h-3.5 w-3.5" /> Export Insights (.pdf)
            </button>
            <button
              onClick={() =>
                toast.promise(new Promise((res) => setTimeout(res, 2000)), {
                  loading: "Analyzing platform trends...",
                  success: "Global behavioral trends updated for Q2 2024.",
                  error: "Failed to update trends.",
                })
              }
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-glow hover:brightness-110 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" /> Platform Trends
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {activeTab === "signature" && <SignatureTab liveSession={liveSession} />}
            {activeTab === "overview" && (
              <OverviewTab liveSession={liveSession} setActiveTab={setActiveTab} />
            )}
            {activeTab === "live" && <LiveMonitoringTab liveSession={liveSession} />}
            {activeTab === "flags" && <AnomalyFlagsTab />}
            {activeTab === "candidates" && <CandidatePipelineTab liveSession={liveSession} />}
            {activeTab === "reports" &&
              (isCandidate ? (
                <CandidateReportsTab />
              ) : (
                <ModuleOptimizationPlaceholder label="Behavioral Reports" />
              ))}
            {activeTab === "settings" &&
              (isCandidate ? (
                <CandidateSettingsTab />
              ) : (
                <ModuleOptimizationPlaceholder label="Platform Settings" />
              ))}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* DEMO CONTROLLER - Judge Ready */}
      <DemoController />
    </div>
  );
}

function ModuleOptimizationPlaceholder({ label }: { label: string }) {
  return (
    <div className="glass-strong rounded-3xl p-12 text-center border-white/5">
      <div className="h-16 w-16 bg-primary/10 rounded-full grid place-items-center mx-auto mb-4">
        <Info className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-2">{label} under optimization</h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        This behavioral engineering intelligence module is being refined for higher cognitive
        precision.
      </p>
    </div>
  );
}

function SignatureTab({ liveSession }: { liveSession: BehavioralSession | null }) {
  const m = liveSession?.metrics || {
    wpm: 64,
    refactor: 18,
    pause: 12,
    continuity: 94,
    typingRhythm: 88,
    refactorDensity: 42,
    pauseDensity: 15,
    semanticContinuity: 96,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-strong rounded-3xl p-8 border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
          <div className="flex items-center gap-3 mb-6">
            <Fingerprint className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold">Your Cognitive Signature</h3>
          </div>
          <p className="text-muted-foreground mb-8 max-w-xl">
            This signature is a unique behavioral fingerprint derived from your typing rhythm, edit
            topology, and semantic evolution during technical assessments.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: "Typing Rhythm", val: `${Math.round(m.typingRhythm || 0)}%`, icon: Waves },
              {
                label: "Refactor Density",
                val: `${Math.round(m.refactorDensity || 0)}%`,
                icon: GitBranch,
              },
              {
                label: "Pause Density",
                val: `${Math.round(m.pauseDensity || 0)}%`,
                icon: Activity,
              },
              {
                label: "Semantic Flow",
                val: `${Math.round(m.semanticContinuity || 0)}%`,
                icon: Brain,
              },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-bold">
                  <stat.icon className="h-3 w-3" /> {stat.label}
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.val}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-8 border-white/5 flex flex-col justify-center text-center">
          <div className="h-20 w-20 rounded-full bg-primary/20 border border-primary/30 grid place-items-center mx-auto mb-4 shadow-glow">
            <Gauge className="h-10 w-10 text-primary" />
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
            Overall Confidence
          </div>
          <div className="text-4xl font-bold text-primary">{m.continuity}%</div>
          <div className="mt-4 text-[10px] text-success font-bold uppercase tracking-widest bg-success/10 py-1 px-3 rounded-full mx-auto">
            Authentic Flow
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-strong rounded-3xl p-6 border-white/5">
          <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Recent Analysis Highlights
          </h4>
          <div className="space-y-4">
            {[
              "High semantic continuity across complex logic blocks.",
              "Healthy refactor-to-typing ratio indicating iterative thought.",
              "Consistent typing rhythm with minimal cognitive bursts.",
            ].map((text, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="h-5 w-5 rounded-full bg-success/20 grid place-items-center shrink-0 mt-0.5">
                  <ShieldCheck className="h-3 w-3 text-success" />
                </div>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-6 border-white/5">
          <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Behavioral Trends
          </h4>
          <div className="h-[120px] w-full flex items-end gap-1.5 px-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex-1 flex flex-col gap-1 items-center">
                <div
                  className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/40 cursor-default"
                  style={{ height: `${30 + Math.random() * 70}%` }}
                />
                <div className="text-[8px] text-muted-foreground font-mono">
                  S{String(i + 1).padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60">
            <span>Historical baseline</span>
            <span>Current performance</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CandidateReportsTab() {
  const sessions = TelemetryStore.getAllSessions();

  const handleExport = (session: BehavioralSession) => {
    const doc = new jsPDF();
    const m = session.metrics;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("PERSONAL BEHAVIORAL ANALYSIS", 20, 30);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Candidate: ${session.candidateName}`, 20, 45);
    doc.text(`Session ID: ${session.id}`, 20, 52);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 59);

    doc.setFont("helvetica", "bold");
    doc.text("COGNITIVE PERFORMANCE METRICS", 20, 75);
    doc.setFont("helvetica", "normal");
    doc.text(`Typing Rhythm: ${Math.round(m.typingRhythm || 0)}%`, 25, 85);
    doc.text(`Refactor Density: ${Math.round(m.refactorDensity || 0)}%`, 25, 92);
    doc.text(`Pause Density: ${Math.round(m.pauseDensity || 0)}%`, 25, 99);
    doc.text(`Semantic Continuity: ${Math.round(m.semanticContinuity || 0)}%`, 25, 106);
    doc.text(`Final Confidence: ${m.continuity}%`, 25, 113);

    doc.setFont("helvetica", "bold");
    doc.text("SITUATIONAL SNAPSHOTS", 20, 130);
    doc.setFont("helvetica", "normal");
    session.snapshots.slice(0, 5).forEach((s, i) => {
      doc.text(`${i + 1}. ${s.label}: ${s.desc.substring(0, 60)}...`, 25, 140 + i * 10);
    });

    doc.save(`behavioral_report_${session.id}.pdf`);
    toast.success("Personal behavioral report exported.");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-strong rounded-3xl border-white/5 overflow-hidden shadow-xl">
        <div className="px-6 py-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div>
            <h3 className="font-bold">Historical Performance Reports</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
              Verified behavioral sessions
            </p>
          </div>
          <FileText className="h-5 w-5 text-primary opacity-50" />
        </div>

        <div className="p-4">
          {sessions.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground italic">
              No behavioral sessions recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary group-hover:scale-110 transition-transform">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{s.language.toUpperCase()} Assessment</div>
                      <div className="text-[10px] text-muted-foreground font-mono">ID: {s.id}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                        Confidence
                      </div>
                      <div className="text-sm font-bold text-success">{s.metrics.continuity}%</div>
                    </div>
                    <button
                      onClick={() => handleExport(s)}
                      className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2"
                    >
                      <Download className="h-3.5 w-3.5" /> Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CandidateSettingsTab() {
  const { userName, userEmail } = useAuth();
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    privacy: true,
    sync: true,
    alerts: false,
    darkMode: true,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-strong rounded-3xl p-6 border-white/5 shadow-xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Intelligence Privacy & Security
            </h3>
            <div className="space-y-4">
              {[
                {
                  id: "privacy",
                  label: "Enhanced Anonymization",
                  desc: "Strip PII from behavioral signatures before institutional syncing.",
                },
                {
                  id: "sync",
                  label: "Real-time Cloud Propagation",
                  desc: "Persist telemetry events across all authorized devices.",
                },
                {
                  id: "alerts",
                  label: "Anomaly Notifications",
                  desc: "Receive real-time alerts when behavioral patterns deviate significantly.",
                },
                {
                  id: "darkMode",
                  label: "Adaptive Interface Theme",
                  desc: "Dynamically adjust interface luminance based on cognitive load.",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 transition-colors hover:bg-white/5"
                >
                  <div className="max-w-md">
                    <div className="text-sm font-bold">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <div
                    onClick={() => setPrefs((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                    className={`h-6 w-11 rounded-full p-1 cursor-pointer transition-colors ${
                      prefs[item.id] ? "bg-primary" : "bg-white/10"
                    }`}
                  >
                    <motion.div
                      animate={{ x: prefs[item.id] ? 20 : 0 }}
                      className="h-4 w-4 rounded-full bg-white shadow-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-6 border-white/5 shadow-xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" /> Account Infrastructure
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-2 font-bold">
                  Verified Identity
                </label>
                <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-sm font-medium">
                  {userName || "Not set"}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-2 font-bold">
                  Encryption Key (Email)
                </label>
                <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-sm font-medium italic opacity-60">
                  {userEmail || "Not set"}
                </div>
              </div>
            </div>
            <button
              onClick={() => toast.success("Identity parameters updated.")}
              className="mt-6 w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all"
            >
              Update Credentials
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-strong rounded-3xl p-8 border-white/5 bg-gradient-to-br from-primary/10 to-transparent flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-3xl bg-primary/20 grid place-items-center mb-4 border border-primary/30 shadow-glow">
              <Cpu className="h-10 w-10 text-primary" />
            </div>
            <h4 className="text-xl font-bold mb-2">Infrastructure Status</h4>
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              Your behavioral analysis engine is running version 4.2.0-beta. Global sync is healthy.
            </p>
            <div className="w-full space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-muted-foreground">Engine Health</span>
                <span className="text-success">Optimal</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[94%] bg-success shadow-glow-success/20" />
              </div>
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-6 border-white/5 flex flex-col gap-4">
            <h4 className="text-sm font-bold tracking-tight">Active API Sessions</h4>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <div className="text-[11px] font-medium">Browser Session: Active</div>
              <div className="ml-auto text-[10px] text-muted-foreground font-mono">12.0.4</div>
            </div>
            <button
              onClick={() => toast.error("Platform reset requires administrative override.")}
              className="w-full py-2.5 rounded-xl border border-danger/30 text-danger text-[10px] font-bold uppercase tracking-widest hover:bg-danger/10 transition-all mt-2"
            >
              Emergency Platform Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({
  liveSession,
  setActiveTab,
}: {
  liveSession: BehavioralSession | null;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Platform Health Indicator - NEW */}
      <div className="glass-strong rounded-3xl p-4 border-white/5 flex items-center justify-between bg-gradient-to-r from-success/10 to-transparent shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-2xl bg-success/20 grid place-items-center text-success border border-success/30">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-success/60">
              Global Integrity Pulse
            </div>
            <div className="text-sm font-bold text-foreground">
              Operational Intelligence Stable{" "}
              <span className="text-success/40 ml-2 font-mono text-[9px]">(12.4ms Latency)</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 pr-4">
          <div className="text-right">
            <div className="text-[10px] font-bold text-muted-foreground uppercase">
              Monitored Sessions
            </div>
            <div className="text-xs font-bold text-foreground">428 Today</div>
          </div>
          <div className="text-right border-l border-white/10 pl-6">
            <div className="text-[10px] font-bold text-muted-foreground uppercase">
              Integrity Confidence
            </div>
            <div className="text-xs font-bold text-primary">99.4% Average</div>
          </div>
        </div>
      </div>

      <CandidateCodingProblemSection />

      <div className="grid grid-cols-4 gap-4 mb-2">
        <IntelligenceCard
          label="Cognitive Confidence"
          value={liveSession ? liveSession.metrics.continuity : 94.2}
          trend={liveSession ? "Live" : "+2.4%"}
          icon={<Brain className="h-4 w-4" />}
          tone="primary"
          data={liveSession ? liveSession.metrics.continuityHistory : [88, 90, 89, 92, 91, 94, 93]}
        />
        <IntelligenceCard
          label="Behavioral Continuity"
          value={liveSession ? liveSession.metrics.continuity - 4 : 88.1}
          trend={liveSession ? "Live" : "+1.2%"}
          icon={<Activity className="h-4 w-4" />}
          tone="accent"
          data={[80, 82, 85, 84, 88, 87, 89]}
        />
        <IntelligenceCard
          label="Typing Velocity"
          value={liveSession ? liveSession.metrics.wpm : 64}
          trend={liveSession ? "Live" : "-0.8%"}
          icon={<Cpu className="h-4 w-4" />}
          tone="violet"
          isCount
          data={liveSession ? liveSession.metrics.wpmHistory : [40, 50, 45, 60, 55, 70, 65]}
        />
        <IntelligenceCard
          label="Anomaly Flags"
          value={
            liveSession
              ? liveSession.events.filter((e) => e.type === "paste" || e.type === "anomaly").length
              : 3
          }
          trend={liveSession ? "Sync" : "Low"}
          icon={<ShieldAlert className="h-4 w-4" />}
          tone="warning"
          isCount
          data={[0, 1, 0, 0, 2, 1, 0]}
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          {/* Candidate Overview Signature Card - NEW */}
          <div className="glass-strong rounded-3xl p-6 border-white/5 shadow-xl bg-gradient-to-br from-accent/10 via-transparent to-transparent relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Fingerprint className="h-24 w-24 text-accent" />
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-accent/20 grid place-items-center text-accent border border-accent/30 shadow-glow-accent/20">
                  <Fingerprint className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    Analyzed Behavioral Signature
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Access the complete high-precision cognitive report, including typing rhythm,
                    refactor topology, and semantic evolution.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("signature")}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent text-white text-sm font-bold shadow-glow-accent/20 hover:brightness-110 hover:-translate-y-0.5 transition-all active:scale-95"
              >
                View Detailed Report <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Behavioral Intelligence Summary - CONNECTED */}
          <div className="glass-strong rounded-3xl p-6 border-white/5 shadow-xl bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Behavioral Intelligence Summary
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">
              <span className="text-primary font-bold">
                {liveSession ? "1 active session" : "12 active sessions"}
              </span>{" "}
              show {liveSession ? "high-fidelity semantic continuity" : "high semantic continuity"}{" "}
              with {liveSession ? "optimal cognitive pacing" : "moderate anomaly density"}.
              Candidate{" "}
              <span className="text-accent font-bold">
                {liveSession ? liveSession.candidateName : "Jessica Wong"}
              </span>{" "}
              demonstrates{" "}
              {liveSession ? "consistent problem-solving markers" : "elite-level cognitive flow"}.
            </p>
          </div>

          <div className="glass-strong rounded-3xl border-white/5 overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold tracking-tight">Active Candidate sessions</h3>
                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest">
                    Real-time telemetry stream
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-bold text-success uppercase">
                  {liveSession ? "Live Sync Active" : "12 Sessions Online"}
                </span>
              </div>
            </div>
            <CandidateTable compact liveSession={liveSession} />
          </div>

          {/* Behavioral Activity Heatmap - NEW */}
          <div className="glass-strong rounded-3xl p-6 border-white/5 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-primary" /> Behavioral Activity Heatmap
              </h3>
              <span className="text-[10px] text-muted-foreground">
                Session Intensity (Last 24h)
              </span>
            </div>
            <div className="grid grid-cols-24 gap-1 h-32">
              {[...Array(24 * 7)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.005 }}
                  className="rounded-[2px]"
                  style={{
                    backgroundColor: `var(--primary)`,
                    opacity: Math.random() > 0.3 ? Math.random() * 0.8 : 0.05,
                  }}
                  whileHover={{ scale: 1.5, zIndex: 10, opacity: 1 }}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-between text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>Now</span>
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-6">
          <RiskDistributionCard />
          <LiveCognitiveStream liveSession={liveSession} />
          <BehavioralAnomaliesFeed liveSession={liveSession} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
}

function CandidateCodingProblemSection() {
  return (
    <div className="glass-strong rounded-3xl border-white/5 shadow-xl p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-2">
            Coding Problem
          </div>
          <h3 className="text-2xl font-semibold tracking-tight">
            Streaming Word Frequency Analyzer
          </h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Present candidates with a modern, dark UI assessment that evaluates streaming parsing
            performance, resilience, and problem-solving flow.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-white/5 border border-white/10 p-4">
            <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
              Difficulty
            </div>
            <div className="mt-2 text-lg font-semibold">Medium</div>
          </div>
          <div className="rounded-3xl bg-white/5 border border-white/10 p-4">
            <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
              Estimated Time
            </div>
            <div className="mt-2 text-lg font-semibold">35 min</div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-[#0B0B0D] border border-white/10 p-6">
          <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-4">
            Problem Overview
          </div>
          <h4 className="text-lg font-semibold tracking-tight">
            Parse a continuous text stream and surface the highest-frequency terms.
          </h4>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Build a streaming parser that maintains aggregate word counts as data arrives, supports
            incremental queries, and keeps memory usage efficient for large inputs.
          </p>
          <div className="mt-6 rounded-3xl bg-background/70 border border-white/10 p-5">
            <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3">
              Constraints
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>• Process the stream in O(n) time while using only O(k) auxiliary space.</li>
              <li>
                • Support incremental updates and point queries without rescanning prior input.
              </li>
              <li>• Handle bursts of high-volume input and return responses with low latency.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-3xl bg-[#09090B] border border-white/10 p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                Example questions
              </div>
              <p className="text-[11px] text-muted-foreground">
                Sample prompts for candidate assessment
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.35em] text-primary">
              50+
            </span>
          </div>
          <div className="grid gap-3 max-h-[430px] overflow-y-auto pr-2">
            {codingQuestions.map((question, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground/80 transition hover:border-primary/30 hover:bg-white/10"
              >
                <span className="font-semibold text-foreground">{index + 1}.</span> {question}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveMonitoringTab({ liveSession }: { liveSession: BehavioralSession | null }) {
  const sessions = [
    {
      name: liveSession?.candidateName || "Alex Johnson",
      task: "Two Sum Evolution",
      wpm: liveSession?.metrics.wpm || 64,
      conf: liveSession?.metrics.continuity || 92,
      status: liveSession ? "Typing..." : "Thinking...",
    },
    {
      name: "Marcus Miller",
      task: "LRU Cache Implementation",
      wpm: 42,
      conf: 87,
      status: "Thinking...",
    },
    { name: "Sarah Chen", task: "Async Event Loop", wpm: 0, conf: 48, status: "Paused" },
    {
      name: "Jessica Wong",
      task: "Binary Tree Restructure",
      wpm: 78,
      conf: 96,
      status: "Refactoring",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      {sessions.map((s, i) => (
        <div
          key={i}
          className="glass-strong rounded-3xl border-white/5 overflow-hidden flex flex-col shadow-xl group"
        >
          <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 grid place-items-center text-[10px] font-bold">
                {s.name[0]}
              </div>
              <div>
                <div className="text-xs font-bold">{s.name}</div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-widest">
                  {s.task}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded bg-success/10 text-success border border-success/20">
                {s.status}
              </span>
              <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 bg-[#050506] p-4 font-mono text-[10px] text-muted-foreground/60 relative">
            <div className="space-y-1">
              <div>
                <span className="text-violet-glow">function</span>{" "}
                <span className="text-accent">solve</span>(input) &#123;
              </div>
              <div className="pl-4">
                <span className="text-violet-glow">const</span> result = [];
              </div>
              <div className="pl-4">
                <span className="text-violet-glow">for</span> (
                <span className="text-violet-glow">let</span> i = 0; i &lt; input.length; i++)
                &#123;
              </div>
              <div className="pl-8 text-foreground/80 font-bold border-l border-primary/40 ml-0.5 pl-3 bg-primary/5">
                <span className="text-violet-glow">if</span> (input[i] % 2 === 0) &#123;
              </div>
              <div className="pl-12">result.push(input[i] * 2);</div>
              <div className="pl-8">&#125;</div>
              <div className="pl-4">&#125;</div>
              <div className="pl-4 text-primary animate-pulse">|</div>
            </div>

            {/* Live Stats Overlay */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <LiveMetricMini label="Typing" value={`${s.wpm} wpm`} tone="var(--electric)" />
              <LiveMetricMini label="Confidence" value={`${s.conf}%`} tone="var(--primary)" />
            </div>
          </div>

          <div className="px-5 py-3 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
              <span className="flex items-center gap-1.5">
                <Cpu className="h-3 w-3" /> Node v20.x
              </span>
              <span className="flex items-center gap-1.5">
                <Activity className="h-3 w-3" /> Telemetry High
              </span>
            </div>
            <Link
              to="/replay"
              className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
            >
              Join Session <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnomalyFlagsTab() {
  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-3xl p-6 border-white/5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-warning/10 grid place-items-center text-warning">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight">Active Signal Anomalies</h3>
            <p className="text-sm text-muted-foreground">
              Behavioral patterns deviating from iterative problem-solving baselines.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge count={2} label="Critical" tone="danger" />
          <Badge count={5} label="Warnings" tone="warning" />
          <Badge count={12} label="Filtered" tone="muted" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          {
            cand: "Sarah Chen",
            type: "Logic Leap",
            severity: "High",
            signal: "Semantic complexity jump +118% in 4ms",
            time: "14:22:04",
            status: "Flagged",
          },
          {
            cand: "Marcus Miller",
            type: "Paste Pattern",
            severity: "Medium",
            signal: "Bulk insertion of 142 chars detected",
            time: "11:58:12",
            status: "Reviewing",
          },
          {
            cand: "Unknown Session",
            type: "Rhythm Shift",
            severity: "Low",
            signal: "Typing cadence deviation (3.4σ)",
            time: "09:12:44",
            status: "Resolved",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="glass rounded-2xl p-5 border-white/5 flex items-center justify-between group hover:bg-white/[0.02] transition-all"
          >
            <div className="flex items-center gap-6">
              <div
                className={`h-10 w-10 rounded-xl grid place-items-center ${f.severity === "High" ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"}`}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold">{f.cand}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">@{f.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-foreground/80">{f.type}</span>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span className="text-xs text-muted-foreground italic">{f.signal}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                  f.status === "Flagged"
                    ? "bg-danger/10 text-danger border-danger/20"
                    : f.status === "Reviewing"
                      ? "bg-warning/10 text-warning border-warning/20"
                      : "bg-success/10 text-success border-success/20"
                }`}
              >
                {f.status}
              </span>
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CandidatePipelineTab({ liveSession }: { liveSession: BehavioralSession | null }) {
  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <PipelineStage label="Screening" count={42} active />
        <PipelineStage label="Behavioral Review" count={12} />
        <PipelineStage label="Interviewing" count={8} />
        <PipelineStage label="Final Evaluation" count={3} />
      </div>
      <div className="glass-strong rounded-3xl border-white/5 overflow-hidden shadow-2xl">
        <CandidateTable liveSession={liveSession} />
      </div>
    </div>
  );
}

function CandidateTable({
  compact,
  liveSession,
}: {
  compact?: boolean;
  liveSession?: BehavioralSession | null;
}) {
  const candidates = [
    {
      name: liveSession?.candidateName || "Bhargav G.",
      role: "Senior Frontend Lead",
      status: liveSession ? "Live" : "Completed",
      score: Math.round(liveSession?.metrics.continuity || 92),
      flags: liveSession?.events.filter((e) => e.type === "paste").length || 0,
      time: "12:04",
    },
    {
      name: "Sarah Chen",
      role: "Senior SRE",
      status: "Completed",
      score: 48,
      flags: 3,
      time: "Yesterday",
    },
    {
      name: "Marcus Miller",
      role: "Backend Developer",
      status: "Completed",
      score: 87,
      flags: 1,
      time: "11:45",
    },
    {
      name: "Jessica Wong",
      role: "Mobile Dev",
      status: "Completed",
      score: 96,
      flags: 0,
      time: "2h ago",
    },
    {
      name: "David Kim",
      role: "DevOps Engineer",
      status: "Completed",
      score: 81,
      flags: 0,
      time: "3h ago",
    },
  ];

  return (
    <div className="p-0 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/[0.01] border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            <th className="px-6 py-4">Candidate</th>
            {!compact && <th className="px-6 py-4">Current Stage</th>}
            <th className="px-6 py-4">Session Status</th>
            <th className="px-6 py-4 text-center">Cognitive Confidence</th>
            <th className="px-6 py-4 text-center">Behavioral Anomalies</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {candidates.slice(0, compact ? 4 : undefined).map((cand, i) => (
            <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 grid place-items-center text-[10px] font-bold text-white/80">
                    {cand.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="text-sm font-bold group-hover:text-primary transition-colors">
                      {cand.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{cand.role}</div>
                  </div>
                </div>
              </td>
              {!compact && (
                <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                  {cand.status === "Live"
                    ? "Interviewing"
                    : cand.status === "Completed"
                      ? "Review"
                      : "Screening"}
                </td>
              )}
              <td className="px-6 py-4">
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                    cand.status === "Live"
                      ? "bg-success/10 text-success border border-success/20"
                      : cand.status === "Screening"
                        ? "bg-accent/10 text-accent border border-accent/20"
                        : "bg-white/5 text-muted-foreground border border-white/10"
                  }`}
                >
                  {cand.status === "Live" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  )}
                  {cand.status}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={`text-sm font-mono font-bold ${cand.score < 50 ? "text-danger" : cand.score < 80 ? "text-warning" : "text-primary"}`}
                  >
                    {cand.score}%
                  </span>
                  <div className="w-20 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000`}
                      style={{
                        width: `${cand.score}%`,
                        background: cand.score < 50 ? "var(--danger)" : "var(--gradient-primary)",
                      }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <div
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold ${cand.flags > 0 ? "text-warning bg-warning/10 border border-warning/20" : "text-muted-foreground bg-white/5 border border-white/10"}`}
                >
                  <ShieldAlert className="h-3 w-3" /> {cand.flags}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary/40 animate-telemetry-pulse" />
                  <Link
                    to="/replay"
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-primary hover:border-primary hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group/btn"
                  >
                    Replay <Play className="h-3 w-3 group-hover/btn:fill-current" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IntelligenceCard({
  label,
  value,
  trend,
  icon,
  tone,
  isCount,
  data,
}: {
  label: string;
  value: number;
  trend: string;
  icon: React.ReactNode;
  tone: string;
  isCount?: boolean;
  data: number[];
}) {
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v: number) =>
    isCount ? Math.floor(v).toString() : v.toFixed(1),
  );
  useEffect(() => {
    animate(mv, value, { duration: 2, ease: "easeOut" });
  }, [value]);

  const colors: Record<string, string> = {
    primary: "var(--primary)",
    accent: "var(--accent)",
    violet: "var(--violet-glow)",
    warning: "var(--warning)",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-strong p-5 rounded-3xl border-white/5 relative overflow-hidden group shadow-lg"
    >
      <div
        className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl opacity-10 group-hover:opacity-30 transition-opacity"
        style={{ background: colors[tone] }}
      />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div
          className="h-9 w-9 rounded-xl grid place-items-center transition-transform group-hover:scale-110"
          style={{ background: `${colors[tone]}15`, color: colors[tone] }}
        >
          {icon}
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="h-1.5 w-1.5 rounded-full animate-telemetry-pulse"
            style={{ background: colors[tone] }}
          />
          <div
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${trend.startsWith("+") ? "bg-success/10 text-success border-success/20" : "bg-white/5 text-muted-foreground border-white/10"}`}
          >
            {trend}
          </div>
        </div>
      </div>
      <div className="flex flex-col relative z-10">
        <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
          {label}
        </div>
        <div className="flex items-baseline gap-1">
          <motion.span className="text-3xl font-bold tracking-tight">{display}</motion.span>
          {!isCount && <span className="text-sm font-medium text-muted-foreground">%</span>}
        </div>

        {/* Real-time Sparkline Integration */}
        <div className="mt-4 h-10 flex items-end gap-0.5 opacity-40">
          {data.map((v, i) => {
            const max = Math.max(...data, 1);
            const h = (v / max) * 100;
            return (
              <motion.div
                key={i}
                className="flex-1 rounded-sm"
                style={{ backgroundColor: colors[tone], height: `${Math.max(10, h)}%` }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function RiskDistributionCard() {
  const data = [
    { label: "Stable", val: 75, color: "var(--success)" },
    { label: "Moderate Anomaly", val: 15, color: "var(--warning)" },
    { label: "High Risk", val: 10, color: "var(--danger)" },
  ];
  return (
    <div className="glass-strong rounded-3xl p-6 border-white/5 shadow-xl">
      <h3 className="text-sm font-bold tracking-tight mb-6 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-primary" /> Cognitive Risk Distribution
      </h3>
      <div className="flex h-4 w-full rounded-full overflow-hidden bg-white/5 mb-6">
        {data.map((d, i) => (
          <motion.div
            key={i}
            initial={{ width: 0 }}
            animate={{ width: `${d.val}%` }}
            className="h-full relative group"
            style={{ backgroundColor: d.color }}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
          </motion.div>
        ))}
      </div>
      <div className="space-y-3">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-muted-foreground font-medium">{d.label}</span>
            </div>
            <span className="font-bold">{d.val}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveCognitiveStream({ liveSession }: { liveSession: BehavioralSession | null }) {
  const events = liveSession
    ? liveSession.events
        .slice(-5)
        .reverse()
        .map((e) => ({
          t: new Date(e.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          m: e.label || `${e.type.charAt(0).toUpperCase() + e.type.slice(1)} detected`,
          type: e.type === "paste" || e.type === "anomaly" ? "warning" : "primary",
        }))
    : [
        { t: "12:04", m: "Semantic restructuring (Jessica Wong)", type: "primary" },
        { t: "12:01", m: "Stable continuity phase (Alex Johnson)", type: "success" },
        { t: "11:58", m: "Optimization transition (Marcus Miller)", type: "primary" },
      ];
  return (
    <div className="glass-strong rounded-3xl p-6 border-white/5 shadow-xl flex flex-col h-[320px]">
      <h3 className="text-sm font-bold tracking-tight mb-4 flex items-center gap-2">
        <Terminal className="h-4 w-4 text-accent" /> Live Cognitive Stream
      </h3>
      <div className="flex-1 overflow-hidden relative">
        <motion.div
          animate={{ y: [0, -100] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="space-y-4"
        >
          {events.map((ev, i) => (
            <div key={i} className="flex gap-3 text-[11px]">
              <span className="text-muted-foreground/40 font-mono shrink-0">{ev.t}</span>
              <div className="flex flex-col gap-1">
                <div className={`flex items-center gap-2 text-${ev.type} font-bold`}>
                  <div className={`h-1 w-1 rounded-full bg-${ev.type}`} />
                  SIGNAL_EVENT
                </div>
                <div className="text-muted-foreground/80 leading-snug">{ev.m}</div>
              </div>
            </div>
          ))}
        </motion.div>
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#0E0E10] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0E0E10] to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

function CohortConfidenceCard() {
  return (
    <div className="glass-strong rounded-3xl p-6 border-white/5 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Fingerprint className="h-20 w-20 text-primary rotate-12" />
      </div>
      <h3 className="text-sm font-bold tracking-tight mb-4 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary" /> Cognitive Evolution
      </h3>
      <div className="h-32 mb-4">
        <Sparkline
          data={[40, 45, 42, 48, 55, 52, 60, 68, 65, 75, 82, 85]}
          stroke="var(--primary)"
          fill="var(--primary)"
          height={128}
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">Confidence Progression</span>
          <span className="text-primary font-bold">+18% vs avg</span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "72%" }}
            className="h-full bg-primary shadow-glow-primary"
            transition={{ duration: 1.5 }}
          />
        </div>
      </div>
    </div>
  );
}

function BehavioralAnomaliesFeed({
  liveSession,
  setActiveTab,
}: {
  liveSession: BehavioralSession | null;
  setActiveTab: (tab: string) => void;
}) {
  const anomalies = liveSession
    ? liveSession.events
        .filter((e) => e.type === "paste" || e.type === "anomaly")
        .slice(-4)
        .map((e) => ({
          type: e.label || "Behavioral Flag",
          candidate: liveSession.candidateName,
          severity: e.type === "paste" ? "High" : "Med",
          time: new Date(e.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }))
    : [
        { type: "Logic Leap", candidate: "Sarah Chen", severity: "High", time: "14:22" },
        { type: "Semantic Shift", candidate: "Marcus Miller", severity: "Med", time: "11:58" },
        { type: "Paste Pattern", candidate: "Unknown", severity: "Med", time: "09:12" },
      ];

  return (
    <div className="glass-strong rounded-3xl p-6 border-white/5 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
          <Activity className="h-4 w-4 text-warning" /> Signal Anomalies
        </h3>
        <button
          onClick={() => setActiveTab("flags")}
          className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
        >
          View All
        </button>
      </div>
      <div className="space-y-4">
        {anomalies.map((an: any, i: number) => (
          <div
            key={i}
            className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-warning/30 transition-all"
          >
            <div
              className={`h-8 w-8 rounded-lg grid place-items-center ${an.severity === "High" ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"}`}
            >
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold">{an.type}</div>
              <div className="text-[10px] text-muted-foreground">
                {an.candidate} · {an.time}
              </div>
            </div>
            <div
              className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${an.severity === "High" ? "bg-danger/10 text-danger border border-danger/20" : "bg-warning/10 text-warning border border-warning/20"}`}
            >
              {an.severity}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveMetricMini({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-background/60 border border-border/20 backdrop-blur-md">
      <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: tone }} />
      <span className="text-[9px] uppercase tracking-tighter text-muted-foreground/80 font-bold">
        {label}
      </span>
      <span className="text-[9px] font-mono text-foreground/70" style={{ color: tone }}>
        {value}
      </span>
    </div>
  );
}

function PipelineStage({
  label,
  count,
  active,
}: {
  label: string;
  count: number;
  active?: boolean;
}) {
  return (
    <button
      className={`flex-1 p-4 rounded-2xl border transition-all text-left ${
        active
          ? "bg-primary/10 border-primary/30 shadow-glow-primary/5"
          : "bg-white/[0.02] border-white/5 hover:border-white/20"
      }`}
    >
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </div>
      <div className="text-2xl font-bold tracking-tight">{count}</div>
    </button>
  );
}

function Badge({ count, label, tone }: { count: number; label: string; tone: string }) {
  const colors: Record<string, string> = {
    danger: "bg-danger/10 text-danger border-danger/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    muted: "bg-white/5 text-muted-foreground border-white/10",
  };
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold ${colors[tone]}`}
    >
      <span className="text-xs">{count}</span>
      <span className="uppercase tracking-tighter">{label}</span>
    </div>
  );
}
function DemoController() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 p-4 rounded-3xl glass-strong border border-primary/20 shadow-2xl w-64 flex flex-col gap-2"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
              <Sparkles className="h-3 w-3" /> Judge Demo Controller
            </div>

            <DemoOption
              label="Strong Engineer"
              desc="Authentic iterative flow"
              onClick={() => TelemetryStore.loadScenario(DEMO_SCENARIOS.STRONG_ENGINEER)}
              tone="primary"
            />
            <DemoOption
              label="AI Injection"
              desc="High-volume paste event"
              onClick={() => TelemetryStore.loadScenario(DEMO_SCENARIOS.AI_ASSISTED)}
              tone="warning"
            />
            <DemoOption
              label="Balanced Profile"
              desc="Typical debugging pattern"
              onClick={() => TelemetryStore.loadScenario(DEMO_SCENARIOS.BALANCED)}
              tone="accent"
            />

            <div className="mt-2 pt-2 border-t border-white/5">
              <p className="text-[9px] text-muted-foreground leading-relaxed italic">
                Instantly populates telemetry, replay data, and behavioral fingerprints.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 rounded-full bg-primary text-white shadow-glow grid place-items-center hover:scale-110 transition-transform active:scale-95"
      >
        <Sparkles className={`h-6 w-6 ${isOpen ? "rotate-180" : ""} transition-transform`} />
      </button>
    </div>
  );
}

function DemoOption({
  label,
  desc,
  onClick,
  tone,
}: {
  label: string;
  desc: string;
  onClick: () => void;
  tone: string;
}) {
  const colors: Record<string, string> = {
    primary: "border-primary/20 hover:bg-primary/10 text-primary",
    warning: "border-warning/20 hover:bg-warning/10 text-warning",
    accent: "border-accent/20 hover:bg-accent/10 text-accent",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-2xl border transition-all group ${colors[tone]}`}
    >
      <div className="text-[11px] font-bold uppercase tracking-tighter">{label}</div>
      <div className="text-[10px] text-muted-foreground/80 leading-none mt-1 group-hover:text-foreground">
        {desc}
      </div>
    </button>
  );
}
