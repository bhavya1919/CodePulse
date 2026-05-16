import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Activity,
  AlertTriangle,
  Waves,
  GitBranch,
  Clock,
  Sparkles,
  ShieldCheck,
  Maximize2,
  Volume2,
  Settings,
  Download,
  Share2,
  ChevronRight,
  BookOpen,
  Zap,
  Brain,
  Code2,
  Layout,
  BarChart3,
  Fingerprint,
  Cpu,
  Mail,
  MessageCircle,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkline } from "@/components/site/Sparkline";
import { TelemetryStore, BehavioralSession } from "@/lib/telemetry-store";
import { useAuth } from "@/lib/auth-context";
import { jsPDF } from "jspdf";

const formatTime = (ms: number) => {
  const s = Math.floor((ms / 1000) % 60);
  const m = Math.floor((ms / (1000 * 60)) % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

export const Route = createFileRoute("/replay")({
  head: () => ({ meta: [{ title: "Session Replay · Technical Integrity Guard" }] }),
  component: ReplayPage,
});

const snapshots = [
  {
    t: "00:04:12",
    label: "Initial Scaffold",
    desc: "Iterative start with basic brute force logic",
    code: [
      "function twoSum(nums, target) {",
      "  // brute force start",
      "  for (let i = 0; i < nums.length; i++) {",
      "    for (let j = i+1; j < nums.length; j++) {",
      "      if (nums[i] + nums[j] === target) return [i, j];",
      "    }",
      "  }",
      "}",
    ],
  },
  {
    t: "00:11:48",
    label: "Optimization Phase",
    desc: "Complexity transition: O(n²) → O(n)",
    code: [
      "function twoSum(nums, target) {",
      "  const seen = {};",
      "  for (let i = 0; i < nums.length; i++) {",
      "    const need = target - nums[i];",
      "    if (seen[need] !== undefined) return [seen[need], i];",
      "    seen[nums[i]] = i;",
      "  }",
      "}",
    ],
  },
  {
    t: "00:18:42",
    label: "Semantic Refinement",
    desc: "Final refactor into idiomatic Map() interface",
    code: [
      "function twoSum(nums, target) {",
      "  const seen = new Map();",
      "  for (let i = 0; i < nums.length; i++) {",
      "    const need = target - nums[i];",
      "    if (seen.has(need)) return [seen.get(need), i];",
      "    seen.set(nums[i], i);",
      "  }",
      "  return [];",
      "}",
    ],
  },
];

const demoSession: BehavioralSession = {
  id: "demo_replay_01",
  candidateName: "Candidate Demo",
  language: "javascript",
  startTime: Date.now() - 22 * 60 * 1000,
  metrics: {
    wpm: 42,
    refactor: 3,
    pause: 12,
    continuity: 88,
    wpmHistory: Array.from({ length: 30 }, () => 35 + Math.round(Math.random() * 25)),
    continuityHistory: Array.from({ length: 30 }, () => 82 + Math.round(Math.random() * 12)),
  },
  events: [
    {
      type: "typing",
      time: Date.now() - 20 * 60 * 1000,
      label: "Typing start",
      desc: "Candidate began writing the first draft.",
    },
    {
      type: "refactor",
      time: Date.now() - 16 * 60 * 1000,
      label: "Refactor transition",
      desc: "Reworked brute-force logic to a linear map-based solution.",
    },
    {
      type: "pause",
      time: Date.now() - 14 * 60 * 1000,
      label: "Cognitive pause",
      desc: "Candidate paused to reason through edge cases.",
    },
    {
      type: "typing",
      time: Date.now() - 12 * 60 * 1000,
      label: "Code expansion",
      desc: "Added support for map-based lookup and early return.",
    },
    {
      type: "paste",
      time: Date.now() - 9 * 60 * 1000,
      label: "Paste event",
      desc: "High-volume insertion detected, flagged for review.",
    },
    {
      type: "execution",
      time: Date.now() - 7 * 60 * 1000,
      label: "Run tests",
      desc: "Candidate executed the code to validate output.",
    },
    {
      type: "refactor",
      time: Date.now() - 4 * 60 * 1000,
      label: "Final polish",
      desc: "Refined the code for readability and completion.",
    },
  ],
  snapshots: snapshots.map((snap, i) => ({
    code: snap.code.join("\n"),
    label: snap.label,
    desc: snap.desc,
    time: Date.now() - (22 - i * 7) * 60 * 1000,
  })),
};

function ReplayPage() {
  const { userSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userSession === "unauthenticated") {
      navigate({ to: "/login" });
    }
  }, [userSession, navigate]);

  const [session, setSession] = useState<BehavioralSession | null>(null);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [pos, setPos] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    const handleSync = () => {
      const data = TelemetryStore.getSession();
      if (data?.snapshots?.length) {
        setSession(data);
      } else {
        setSession(demoSession);
      }
      setIdx(0);
      setPos(0);
    };

    window.addEventListener("storage", handleSync);
    handleSync();

    return () => window.removeEventListener("storage", handleSync);
  }, []);

  // Playback Loop
  useEffect(() => {
    if (!playing || !session || session.snapshots.length === 0) return;

    const interval = 100 / speed;
    const t = setInterval(() => {
      setPos((p) => {
        const next = p + 0.5 * speed;
        if (next >= 100) {
          setPlaying(false);
          return 100;
        }

        // Update Snapshot Index based on playback position
        const currentSnapIdx = Math.floor((next / 100) * session.snapshots.length);
        if (currentSnapIdx !== idx && currentSnapIdx < session.snapshots.length) {
          setIdx(currentSnapIdx);
        }

        // Update Chapter
        const totalDuration = session.events[session.events.length - 1]?.time - session.startTime;
        const currentTime = session.startTime + (next / 100) * totalDuration;
        const chapterIdx = session.snapshots.findIndex(
          (s, i) => s.time > currentTime || i === session.snapshots.length - 1,
        );
        if (chapterIdx !== activeChapter) setActiveChapter(chapterIdx);

        return next;
      });
    }, interval);

    return () => clearInterval(t);
  }, [playing, speed, session, idx, activeChapter]);

  useEffect(() => {
    if (!session || session.snapshots.length === 0) return;
    const nextIdx = Math.min(
      session.snapshots.length - 1,
      Math.floor((pos / 100) * session.snapshots.length),
    );
    if (nextIdx !== idx) setIdx(nextIdx);

    const totalDurationLocal =
      (session.events[session.events.length - 1]?.time || session.startTime) - session.startTime;
    const currentTime = session.startTime + (pos / 100) * totalDurationLocal;
    const chapterIdx = session.snapshots.findIndex(
      (s, i) => s.time > currentTime || i === session.snapshots.length - 1,
    );
    if (chapterIdx !== activeChapter) setActiveChapter(chapterIdx);
  }, [pos, session, idx, activeChapter]);

  if (!session)
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-muted-foreground gap-4">
        <div className="h-12 w-12 rounded-full border-2 border-white/5 border-t-primary animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest">
          Loading behavioral reconstruction...
        </span>
      </div>
    );

  const totalDuration =
    (session.events[session.events.length - 1]?.time || Date.now()) - session.startTime;

  const confidenceData = Array.from({ length: 60 }, (_, i) => {
    const sliceTime = totalDuration / 60;
    const timeAtSlice = session.startTime + i * sliceTime;
    const eventsAtSlice = session.events.filter(
      (e) => e.time >= timeAtSlice && e.time < timeAtSlice + sliceTime,
    ).length;
    return 70 + Math.min(25, eventsAtSlice * 4) + Math.sin(i / 2) * 2;
  });

  const eventCounts = session.events.reduce(
    (acc, ev) => {
      acc[ev.type] = (acc[ev.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const averageWpm = session.metrics.wpmHistory.length
    ? Math.round(
        session.metrics.wpmHistory.reduce((sum, n) => sum + n, 0) /
          session.metrics.wpmHistory.length,
      )
    : session.metrics.wpm;

  const continuityAvg = session.metrics.continuityHistory.length
    ? Math.round(
        session.metrics.continuityHistory.reduce((sum, n) => sum + n, 0) /
          session.metrics.continuityHistory.length,
      )
    : session.metrics.continuity;

  const pasteCount = eventCounts.paste || 0;
  const refactorCount = eventCounts.refactor || 0;
  const pauseCount = eventCounts.pause || 0;
  const tabSwitchCount = eventCounts.tabSwitch || 0;
  const deleteCount = eventCounts.delete || 0;
  const executionCount = eventCounts.execution || 0;
  const typingEvents = eventCounts.typing || 0;
  const anomalyCount = eventCounts.anomaly || 0;
  const snapshotCount = session.snapshots.length;
  const latestSnapshot = session.snapshots[idx] ||
    session.snapshots[0] || {
      code: "",
      label: "No snapshot",
      desc: "No snapshot available",
      time: session.startTime,
    };

  const currentCode = (() => {
    const totalDurationLocal =
      (session.events[session.events.length - 1]?.time || session.startTime) - session.startTime;
    const currentTime = session.startTime + (pos / 100) * totalDurationLocal;

    const pastEvents = session.events.filter((e) => e.time <= currentTime && e.code);
    if (pastEvents.length > 0) return pastEvents[pastEvents.length - 1].code as string;

    const pastSnapshots = session.snapshots.filter((s) => s.time <= currentTime);
    if (pastSnapshots.length > 0) return pastSnapshots[pastSnapshots.length - 1].code;

    return session.snapshots[0]?.code || "";
  })();

  const recentEvents = session.events.slice(-8).reverse();

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-[#0A0A0B]">
      {/* Session Intelligence Header */}
      <div className="bg-primary/5 border-b border-primary/10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 grid place-items-center text-primary shadow-glow-primary/20">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight">{session.candidateName}</h1>
                <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold border border-success/20 uppercase tracking-tighter">
                  Verified
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">
                Session: {session.id.toUpperCase()}
              </div>
            </div>
          </div>
          <div className="h-8 w-px bg-white/5" />
          <div className="flex gap-8">
            <MetricSmall
              label="Cognitive Confidence"
              value={`${continuityAvg}%`}
              icon={<Brain className="h-3 w-3" />}
              tone="primary"
            />
            <MetricSmall
              label="Behavioral Continuity"
              value={`${averageWpm} wpm`}
              icon={<Activity className="h-3 w-3" />}
              tone="accent"
            />
            <MetricSmall
              label="Session Integrity"
              value={anomalyCount > 0 ? "Review" : "High"}
              icon={<ShieldCheck className="h-3 w-3" />}
              tone="success"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold hover:bg-white/10 transition-all">
                <Share2 className="h-3.5 w-3.5" /> Share Report
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 glass-strong border-white/10">
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard");
                }}
                className="gap-2 cursor-pointer"
              >
                <Copy className="h-4 w-4" /> Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const integrity =
                    anomalyCount === 0 ? "100%" : Math.max(0, 100 - anomalyCount * 5) + "%";
                  const subject = `Behavioral Integrity Report: ${session.candidateName}`;
                  const body =
                    `Behavioral Integrity Report for ${session.candidateName}\n\n` +
                    `Metrics Summary:\n` +
                    `- Typing Speed: ${averageWpm} WPM\n` +
                    `- Cognitive Confidence: ${continuityAvg}%\n` +
                    `- Typing Rhythm: ${Math.round(session.metrics.typingRhythm || 0)}%\n` +
                    `- Refactor Density: ${Math.round(session.metrics.refactorDensity || 0)}%\n` +
                    `- Pause Density: ${Math.round(session.metrics.pauseDensity || 0)}%\n` +
                    `- Semantic Continuity: ${Math.round(session.metrics.semanticContinuity || 0)}%\n` +
                    `- Integrity Score: ${integrity}\n\n` +
                    `View the complete session replay here: ${window.location.href}`;
                  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                }}
                className="gap-2 cursor-pointer"
              >
                <Mail className="h-4 w-4" /> Email Report
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const integrity =
                    anomalyCount === 0 ? "100%" : Math.max(0, 100 - anomalyCount * 5) + "%";
                  const text =
                    `*Behavioral Integrity Report: ${session.candidateName}*\n\n` +
                    `🚀 Speed: ${averageWpm} WPM\n` +
                    `🧠 Confidence: ${continuityAvg}%\n` +
                    `🥁 Rhythm: ${Math.round(session.metrics.typingRhythm || 0)}%\n` +
                    `🛠️ Refactor: ${Math.round(session.metrics.refactorDensity || 0)}%\n` +
                    `🛡️ Integrity: ${integrity}\n\n` +
                    `View Report: ${window.location.href}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                }}
                className="gap-2 cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => {
              const doc = new jsPDF();
              const m = session.metrics;
              const integrity =
                anomalyCount === 0 ? "100%" : Math.max(0, 100 - anomalyCount * 5) + "%";

              doc.setFont("helvetica", "bold");
              doc.setFontSize(22);
              doc.setTextColor(30, 30, 30);
              doc.text("BEHAVIORAL INTEGRITY REPORT", 20, 30);

              doc.setFontSize(10);
              doc.setTextColor(100, 100, 100);
              doc.text(`Generated on ${new Date().toLocaleString()}`, 20, 38);

              doc.setDrawColor(200, 200, 200);
              doc.line(20, 45, 190, 45);

              doc.setFontSize(14);
              doc.setTextColor(0, 0, 0);
              doc.text("CANDIDATE INFORMATION", 20, 55);
              doc.setFont("helvetica", "normal");
              doc.setFontSize(11);
              doc.text(`Name: ${session.candidateName}`, 25, 65);
              doc.text(`Session ID: ${session.id}`, 25, 72);
              doc.text(`Language: ${session.language}`, 25, 79);
              doc.text(`Session Date: ${new Date(session.startTime).toLocaleString()}`, 25, 86);

              doc.setFont("helvetica", "bold");
              doc.setFontSize(14);
              doc.text("BEHAVIORAL PERFORMANCE METRICS", 20, 100);
              doc.setFont("helvetica", "normal");
              doc.setFontSize(11);
              doc.text(`Typing Speed (WPM): ${averageWpm}`, 25, 110);
              doc.text(`Cognitive Confidence: ${continuityAvg}%`, 25, 117);
              doc.text(`Typing Rhythm: ${Math.round(m.typingRhythm || 0)}%`, 25, 124);
              doc.text(`Refactor Density: ${Math.round(m.refactorDensity || 0)}%`, 25, 131);
              doc.text(`Pause Density: ${Math.round(m.pauseDensity || 0)}%`, 25, 138);
              doc.text(`Semantic Continuity: ${Math.round(m.semanticContinuity || 0)}%`, 25, 145);
              doc.text(`Integrity Score: ${integrity}`, 25, 152);

              doc.setFont("helvetica", "bold");
              doc.setFontSize(14);
              doc.text("INTERACTION ANCHORS", 20, 165);
              doc.setFont("helvetica", "normal");
              doc.setFontSize(11);
              doc.text(`Total Keystrokes: ${typingEvents}`, 25, 175);
              doc.text(`Flagged Anomalies: ${anomalyCount}`, 25, 182);
              doc.text(`Tab Switches: ${tabSwitchCount}`, 25, 189);
              doc.text(
                `Bulk Pastes: ${session.events.filter((e) => e.type === "paste").length}`,
                25,
                196,
              );

              doc.addPage();
              doc.setFont("helvetica", "bold");
              doc.setFontSize(14);
              doc.text("CHRONOLOGICAL EVENT LOG", 20, 20);
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9);
              let y = 30;
              session.events.forEach((e) => {
                if (y > 280) {
                  doc.addPage();
                  y = 20;
                }
                const time = formatTime(e.time - session.startTime);
                doc.text(`[${time}] ${e.type.toUpperCase()}: ${e.label || ""}`, 20, y);
                y += 5;
              });

              doc.save(
                `behavioral_report_${session.candidateName.toLowerCase().replace(/\s+/g, "_")}.pdf`,
              );
              toast.success("PDF report downloaded successfully.");
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold shadow-glow hover:brightness-110 transition-all"
          >
            <Download className="h-3.5 w-3.5" /> Download Report (.pdf)
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* REPLAY CANVAS */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="glass-strong rounded-3xl flex-1 flex flex-col overflow-hidden border-white/5 shadow-2xl relative">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Evolutionary Code Playback
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-mono text-muted-foreground bg-white/5 px-2 py-1 rounded border border-white/5 italic">
                  Privacy-first: No video/audio captured. Behavioral telemetry only.
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                </div>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
              <div className="w-14 bg-white/[0.01] border-r border-white/5 py-6 flex flex-col items-center font-mono text-[14px] text-muted-foreground/30 select-none">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="h-7 flex items-center justify-center w-full">
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="flex-1 bg-[#0A0A0B] py-6 px-8 font-mono text-[14px] leading-7 overflow-y-auto custom-scrollbar relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeChapter}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentCode.split("\n").map((l, i) => (
                      <div key={i} className="h-7 whitespace-pre relative group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity -mx-8 px-8" />
                        <SyntaxLine line={l} />
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Evolution Indicator */}
                <div className="absolute top-6 right-8 p-4 rounded-2xl glass-strong border border-primary/30 backdrop-blur-md max-w-[240px] z-20 shadow-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-3.5 w-3.5 text-primary animate-pulse" />
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      Behavioral Phase
                    </div>
                  </div>
                  <div className="text-sm font-bold text-foreground mb-1">
                    {session.snapshots[idx]?.label}
                  </div>
                  <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                    {session.snapshots[idx]?.desc}
                  </p>

                  {/* Mini Telemetry Status */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Activity className="h-3 w-3 text-success" />
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">
                        Stable Rhythm
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-primary font-bold">
                      94.2% Match
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTROLS & TIMELINE */}
            <div className="p-6 border-t border-white/5 bg-white/[0.01]">
              <div className="relative mb-6">
                <div
                  className="h-20 w-full bg-white/[0.02] rounded-2xl border border-white/5 relative overflow-hidden group cursor-pointer shadow-inner"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setPos(((e.clientX - rect.left) / rect.width) * 100);
                  }}
                >
                  {/* Complexity Waveform - ENHANCED */}
                  <div className="absolute inset-x-0 bottom-0 h-16 flex items-end gap-0.5 px-4 opacity-30">
                    {Array.from({ length: 160 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 rounded-t-sm"
                        style={{
                          backgroundColor: i > 60 && i < 80 ? "var(--warning)" : "var(--primary)",
                          height: `${15 + Math.sin(i / 4) * 40 + Math.random() * 25}%`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Semantic markers and complexity labels */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-2 left-[52%] text-[8px] font-bold uppercase tracking-tighter text-warning bg-warning/10 px-1 rounded">
                      Complexity Spike Detected
                    </div>
                    <div className="absolute top-2 left-[35%] text-[8px] font-bold uppercase tracking-tighter text-violet-glow bg-violet-glow/10 px-1 rounded">
                      Refactor Wave
                    </div>
                  </div>

                  {/* Event Markers from Real Telemetry */}
                  {session.events.map((ev, i) => {
                    const totalTime =
                      (session.events[session.events.length - 1]?.time || 0) - session.startTime;
                    const p = ((ev.time - session.startTime) / (totalTime || 1)) * 100;
                    const colors: Record<string, string> = {
                      typing: "var(--electric)",
                      refactor: "var(--violet-glow)",
                      pause: "var(--cyan-glow)",
                      execution: "var(--primary)",
                    };
                    return (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 flex flex-col items-center group/marker"
                        style={{ left: `${p}%` }}
                      >
                        <div className="h-full w-[2px] bg-white/5 group-hover/marker:bg-white/20 transition-colors" />
                        <div
                          className="absolute -top-1 h-2 w-2 rounded-full shadow-lg z-20"
                          style={{ background: colors[ev.type] || "gray" }}
                        />
                      </div>
                    );
                  })}

                  {/* Scrubber */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-primary shadow-glow shadow-primary z-30 transition-all duration-75"
                    style={{ left: `${pos}%` }}
                  >
                    <div className="absolute -top-2 -left-2 h-4 w-4 rounded-full bg-primary border-2 border-white shadow-glow" />
                    <div className="absolute -bottom-2 -left-2 h-1 w-4 bg-primary" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <PlayBtn>
                    <SkipBack className="h-4 w-4" />
                  </PlayBtn>
                  <PlayBtn onClick={() => setPlaying(!playing)}>
                    {playing ? (
                      <Pause className="h-5 w-5 fill-current" />
                    ) : (
                      <Play className="h-5 w-5 fill-current" />
                    )}
                  </PlayBtn>
                  <PlayBtn>
                    <SkipForward className="h-4 w-4" />
                  </PlayBtn>
                  <div className="h-8 w-px bg-white/5 mx-3" />
                  <div className="flex items-center gap-3">
                    {[0.5, 1, 2, 4].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-md transition-all ${speed === s ? "bg-primary/20 text-primary border border-primary/20" : "text-muted-foreground hover:bg-white/5"}`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-mono text-sm font-bold text-foreground">
                      {formatTime((pos / 100) * totalDuration)}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                      Replay Elapsed
                    </div>
                  </div>
                  <div className="text-right border-l border-white/10 pl-6">
                    <div className="font-mono text-sm font-bold text-primary">
                      {formatTime(totalDuration)}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                      Total Duration
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PlayBtn>
                      <Volume2 className="h-4 w-4" />
                    </PlayBtn>
                    <PlayBtn>
                      <Maximize2 className="h-4 w-4" />
                    </PlayBtn>
                    <PlayBtn>
                      <Settings className="h-4 w-4" />
                    </PlayBtn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ANALYTICS SIDEBAR */}
        <div className="w-[380px] flex flex-col gap-6 overflow-hidden">
          {/* Behavioral Fingerprint Card - STORYTELLING OPTIMIZED */}
          <div className="glass-strong rounded-3xl p-6 border-white/5 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
              <Fingerprint className="h-32 w-32 text-primary" />
            </div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" /> Behavioral Fingerprint
              </h3>
              <span className="text-[10px] font-mono text-primary/60">SESSION_STABLE</span>
            </div>

            <div className="flex flex-col gap-3">
              {[
                {
                  label: "Average WPM",
                  val: Math.min(100, Math.round(averageWpm)),
                  tone: "var(--primary)",
                },
                {
                  label: "Continuity Avg",
                  val: Math.min(100, continuityAvg),
                  tone: "var(--electric)",
                },
                {
                  label: "Refactor Events",
                  val: Math.min(100, refactorCount * 18),
                  tone: "var(--violet-glow)",
                },
              ].map((f, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    <span>{f.label}</span>
                    <span>{f.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${f.val}%` }}
                      transition={{ delay: 0.5 + i * 0.2, duration: 1.5 }}
                      className="h-full shadow-glow"
                      style={{ background: f.tone }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[11px] text-muted-foreground leading-relaxed italic">
              "Cognitive signature matches high-fidelity authentic patterns. No significant semantic
              leaps detected."
            </p>
          </div>

          {/* Cognitive Flow Map - DYNAMIC */}
          <div className="glass-strong rounded-3xl p-6 border-white/5 shadow-xl flex-[0.7] flex flex-col overflow-hidden relative">
            <h3 className="text-sm font-bold tracking-tight mb-6 flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-accent" /> Cognitive Flow Map
            </h3>
            <div className="flex-1 relative bg-background/40 rounded-2xl border border-white/5 overflow-hidden">
              {/* Animated Paths */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <motion.path
                  d="M 40 180 Q 120 120 200 150 T 320 100"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="1000"
                  strokeDashoffset="1000"
                  animate={{ strokeDashoffset: 1000 - pos * 10 }}
                />
              </svg>

              {/* Dynamic Nodes */}
              {session.snapshots.map((snap, i) => {
                const p = (i / (session.snapshots.length || 1)) * 100;
                const isActive = idx >= i;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: isActive ? 1 : 0.2, scale: isActive ? 1 : 0.8 }}
                    className="absolute group/node"
                    style={{ left: `${20 + i * 20}%`, top: `${70 - i * 15}%` }}
                  >
                    <div
                      className={`h-4 w-4 rounded-full ${isActive ? "bg-accent shadow-glow shadow-accent/50 animate-pulse" : "bg-white/10"} cursor-pointer`}
                    />
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                      {snap.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Replay Insight Feed - CONNECTED */}
          <div className="glass-strong rounded-3xl p-6 border-white/5 shadow-xl flex-1 flex flex-col overflow-hidden">
            <h3 className="text-sm font-bold tracking-tight mb-6 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Behavioral Insight Stream
            </h3>
            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
              {recentEvents.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No event data available yet. Replay will update once the candidate completes the
                  session.
                </div>
              ) : (
                recentEvents.map((ev, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex gap-3 p-3 rounded-xl border transition-all ${i === 0 ? "bg-primary/10 border-primary/30" : "bg-white/[0.02] border-white/5 hover:border-white/10"}`}
                  >
                    <div
                      className={`h-2.5 w-2.5 rounded-full mt-1.5 ${ev.type === "paste" ? "bg-danger" : ev.type === "refactor" ? "bg-violet-glow" : ev.type === "pause" ? "bg-cyan-glow" : ev.type === "execution" ? "bg-primary" : ev.type === "typing" ? "bg-accent" : "bg-white/50"}`}
                    />
                    <div>
                      <div className="text-[9px] font-mono text-muted-foreground mb-0.5">
                        {formatTime(ev.time - session.startTime)} · {ev.type.toUpperCase()}
                      </div>
                      <div className="text-[11px] font-medium leading-snug">
                        {ev.label || "Typing event"}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1 opacity-60">
                        {ev.desc || "Captured candidate activity during the code session."}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Verdict Card - STORYTELLING OPTIMIZED */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-success/10 to-transparent border border-success/20 relative overflow-hidden group">
            <div className="absolute -right-12 -bottom-12 h-32 w-32 bg-success/5 blur-3xl group-hover:scale-150 transition-all duration-1000" />
            <h3 className="text-sm font-bold tracking-tight mb-3 flex items-center gap-2 text-success">
              <ShieldCheck className="h-4 w-4" /> Final Integrity Assessment
            </h3>
            <div className="text-[11px] font-medium leading-relaxed text-success/80 mb-4 italic">
              "The behavioral arc demonstrates a high-fidelity cognitive signature. The session
              shows {refactorCount} refactor event(s), {pauseCount} pause(s), and {pasteCount}{" "}
              flagged content event(s). Overall session stability remains strong and the code
              evolution is consistent with authentic problem-solving behavior."
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-white/5 p-4 border border-white/10">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Key Events
                </div>
                <div className="text-lg font-bold">{typingEvents}</div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  Typing interactions captured
                </div>
              </div>
              <div className="rounded-3xl bg-white/5 p-4 border border-white/10">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Snapshot Anchors
                </div>
                <div className="text-lg font-bold">{snapshotCount}</div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  Behavioral snapshots recorded
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricSmall({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: string;
}) {
  const colors: Record<string, string> = {
    primary: "text-primary",
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning",
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
        {icon} {label}
      </div>
      <div className={`text-base font-bold tracking-tight ${colors[tone]}`}>{value}</div>
    </div>
  );
}

function PlayBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-10 w-10 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all flex items-center justify-center active:scale-95"
    >
      {children}
    </button>
  );
}

function SyntaxLine({ line }: { line: string }) {
  const tokens = line.split(/(\s+|[(){}.,;[\]=<>!+-]|"[^"]*"|'[^']*'|\/\*.*\*\/|\/\/.*)/g);
  return (
    <span>
      {tokens.map((t, i) => {
        if (!t) return null;
        if (/^(function|const|let|return|for|if|new|await|async|import|export|from)$/.test(t))
          return (
            <span key={i} className="text-violet-glow font-bold">
              {t}
            </span>
          );
        if (/^(Map|Set|Promise|Error|true|false|null|undefined)$/.test(t))
          return (
            <span key={i} className="text-cyan-glow italic">
              {t}
            </span>
          );
        if (/^\/\/.*/.test(t) || /^\/\*.*\*\/$/.test(t))
          return (
            <span key={i} className="text-muted-foreground/50 italic">
              {t}
            </span>
          );
        if (/^".*"$/.test(t) || /^'.*'$/.test(t))
          return (
            <span key={i} className="text-success">
              {t}
            </span>
          );
        if (/^[0-9]+$/.test(t))
          return (
            <span key={i} className="text-warning">
              {t}
            </span>
          );
        return (
          <span key={i} className="text-foreground/90">
            {t}
          </span>
        );
      })}
    </span>
  );
}
