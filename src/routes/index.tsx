import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  ShieldCheck,
  Eye,
  Cpu,
  GitBranch,
  LineChart,
  Lock,
  Sparkles,
  Waves,
  Gauge,
  Layers,
  ArrowRight,
  Play,
  Fingerprint,
  Radar,
  AlertTriangle,
  EyeOff,
  MonitorOff,
  Webcam,
  FileWarning,
} from "lucide-react";
import { Sparkline } from "@/components/site/Sparkline";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Technical Integrity Guard — Behavioral Engineering Intelligence" },
      {
        name: "description",
        content:
          "Cognitive coding signatures and integrity-aware hiring intelligence for the AI era.",
      },
    ],
  }),
  component: Landing,
});

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const },
};

function Landing() {
  return (
    <main className="relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid animate-grid-flow absolute inset-0 opacity-20" />
        <div className="absolute top-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] animate-float" />
        <div
          className="absolute bottom-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px] animate-float"
          style={{ animationDelay: "-2s" }}
        />
        <div className="absolute top-[40%] right-[10%] h-[300px] w-[300px] rounded-full bg-cyan-glow/5 blur-[80px]" />
      </div>

      <Hero />
      <Problem />
      <CognitiveFlowPreview />
      <Solution />
      <HowItWorks />
      <Features />
      <Privacy />
      <CTA />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative pt-16 pb-28 md:pt-24 md:pb-36">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.div
            {...fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Behavioral engineering intelligence · v2.4
          </motion.div>
          <motion.h1
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.05 }}
            className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
          >
            Understand how engineers <span className="text-gradient">think</span> — not just what
            they submit.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg"
          >
            Technical Integrity Guard analyzes coding behavior, problem-solving flow, and semantic
            evolution to create integrity-aware hiring intelligence for the AI era.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to="/interview"
              className="group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Play className="h-4 w-4" /> Launch Demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-secondary/40 px-5 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              <LineChart className="h-4 w-4" /> View Recruiter Dashboard
            </Link>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.25 }}
            className="mt-10 grid max-w-lg grid-cols-3 gap-3"
          >
            {[
              { k: "98.4%", v: "Signature accuracy" },
              { k: "12ms", v: "Telemetry latency" },
              { k: "0", v: "Webcam frames" },
            ].map((s) => (
              <div key={s.v} className="glass rounded-xl p-3">
                <div className="text-xl font-semibold text-gradient">{s.k}</div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {s.v}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="lg:col-span-5">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  const data = [4, 8, 6, 11, 9, 14, 12, 18, 22, 17, 24, 28, 22, 30, 27, 33, 31, 38];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative"
    >
      <div className="glass-strong glow-border relative z-10 rounded-3xl p-5 shadow-glow">
        {/* live telemetry header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radar className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Live Telemetry
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" /> streaming
          </div>
        </div>

        {/* anomaly graph */}
        <div className="mt-4 rounded-2xl border border-border/60 bg-background/40 p-4 relative overflow-hidden group">
          <div className="shimmer absolute inset-0 opacity-10 pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <div className="text-sm font-medium">Anomaly Index</div>
            <div className="text-xs text-muted-foreground">last 60s</div>
          </div>
          <div className="relative z-10">
            <Sparkline data={data} stroke="var(--electric)" fill="var(--electric)" height={92} />
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground relative z-10">
            <span>baseline</span>
            <span>spike +38%</span>
            <span>now</span>
          </div>
        </div>

        {/* grid of widgets */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Widget
            icon={<Gauge className="h-3.5 w-3.5" />}
            label="Confidence"
            value="87%"
            tone="cyan"
            sub="authentic flow"
          />
          <Widget
            icon={<Brain className="h-3.5 w-3.5" />}
            label="Cognitive Load"
            value="0.62"
            tone="violet"
            sub="iterative"
          />
          <Widget
            icon={<GitBranch className="h-3.5 w-3.5" />}
            label="Refactor Cycles"
            value="14"
            tone="electric"
            sub="healthy"
          />
          <Widget
            icon={<Activity className="h-3.5 w-3.5" />}
            label="Pause Bursts"
            value="9"
            tone="warn"
            sub="thinking"
          />
        </div>

        {/* typing dynamics section */}
        <div className="mt-4 rounded-2xl border border-border/60 bg-background/40 p-4">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="font-medium flex items-center gap-2">
              <Waves className="h-3.5 w-3.5 text-primary" />
              Typing Rhythm Simulation
            </span>
            <span className="text-primary/60 font-mono">|| ||| | || ||||</span>
          </div>
          <div className="flex gap-1 h-8 items-end">
            {[...Array(24)].map((_, i) => (
              <motion.div
                key={i}
                className="w-full bg-primary/20 rounded-t-sm"
                animate={{ height: [`${20 + Math.random() * 80}%`, `${20 + Math.random() * 80}%`] }}
                transition={{
                  duration: 0.5 + Math.random(),
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* background pulse elements */}
      <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-3xl bg-primary/5 blur-2xl" />

      {/* floating widgets */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="glass absolute -left-6 top-16 hidden rounded-2xl p-3 shadow-glow-violet md:block hover-glow cursor-default z-20"
      >
        <div className="flex items-center gap-2 text-xs">
          <Fingerprint className="h-4 w-4 text-accent" /> Cognitive Signature
        </div>
        <div className="mt-1 text-lg font-semibold font-mono">σ-7A·19B·42C</div>
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="glass absolute -right-4 bottom-10 hidden rounded-2xl p-3 md:block hover-glow cursor-default z-20"
      >
        <div className="flex items-center gap-2 text-xs">
          <AlertTriangle className="h-4 w-4 text-warning" /> Logic Leap
        </div>
        <div className="mt-1 text-lg font-semibold">+38% complexity</div>
      </motion.div>
    </motion.div>
  );
}

function Widget({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tone: "cyan" | "violet" | "electric" | "warn";
}) {
  const map = {
    cyan: "var(--cyan-glow)",
    violet: "var(--violet-glow)",
    electric: "var(--electric)",
    warn: "var(--warning)",
  } as const;
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          {icon}
          {label}
        </span>
        <span
          className="h-1.5 w-1.5 rounded-full animate-pulse-glow"
          style={{ background: map[tone] }}
        />
      </div>
      <div className="mt-1.5 text-xl font-semibold" style={{ color: map[tone] }}>
        {value}
      </div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function Problem() {
  const items = [
    {
      icon: Cpu,
      title: "AI-generated solutions",
      desc: "Submitted code increasingly reflects model output, not engineering thought.",
    },
    {
      icon: Webcam,
      title: "Webcam fatigue",
      desc: "Candidates burn out under invasive proctoring and surveillance theatre.",
    },
    {
      icon: EyeOff,
      title: "Invasive surveillance",
      desc: "Eye tracking and screen capture damage trust and signal nothing useful.",
    },
    {
      icon: FileWarning,
      title: "Unreliable tests",
      desc: "Pass/fail outcomes hide how the answer was actually reached.",
    },
    {
      icon: MonitorOff,
      title: "No behavioral insight",
      desc: "Recruiters see the destination but never the path the candidate took.",
    },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div {...fadeUp} className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.22em] text-primary">The problem</div>
          <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
            Traditional technical interviews are broken.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Submission-only evaluation cannot keep up with how modern engineers — and modern models
            — actually write code.
          </p>
        </motion.div>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.05 }}
              className="glass rounded-2xl p-5 hover-glow"
            >
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary/60 text-primary">
                <it.icon className="h-4 w-4" />
              </div>
              <div className="mt-4 font-semibold">{it.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{it.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CognitiveFlowPreview() {
  return (
    <section className="relative py-24 bg-secondary/20 overflow-hidden">
      <div className="bg-grid animate-grid-flow absolute inset-0 opacity-10 pointer-events-none" />
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
              <Play className="h-3.5 w-3.5" /> Premium Preview
            </div>
            <h2 className="text-4xl font-bold mb-6">Cognitive Flow Replay</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Experience the evolution of a solution. Our high-fidelity replay captures the semantic
              trajectory, not just the text.
            </p>
            <ul className="space-y-4">
              {[
                {
                  t: "Code Evolution Playback",
                  d: "Watch logic emerge through iterative refinement.",
                },
                {
                  t: "Semantic Refinement Signals",
                  d: "Detect where the candidate optimized vs. where they struggled.",
                },
                {
                  t: "Behavioral Telemetry Markers",
                  d: "Interactive timeline showing cognitive pause clusters.",
                },
              ].map((item) => (
                <li key={item.t} className="flex gap-4">
                  <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-primary/20 grid place-items-center">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  </div>
                  <div>
                    <div className="font-semibold">{item.t}</div>
                    <div className="text-sm text-muted-foreground">{item.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="glass-strong rounded-3xl p-1 overflow-hidden shadow-2xl border-border/40">
              <div className="bg-background/80 p-6 font-mono text-sm">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/40">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-destructive/50" />
                    <div className="h-3 w-3 rounded-full bg-warning/50" />
                    <div className="h-3 w-3 rounded-full bg-success/50" />
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    Semantic Replay Active
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">
                    1 <span className="text-primary">async function</span>{" "}
                    <span className="text-cyan-glow">processData</span>(stream) {"{"}
                  </div>
                  <div className="text-muted-foreground">
                    2 <span className="text-primary">const</span> result = [];
                  </div>
                  <div className="flex gap-4">
                    <div className="text-muted-foreground">3</div>
                    <motion.div
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="bg-primary/20 border-l-2 border-primary px-1"
                    >
                      <span className="text-success">for await</span> (const chunk of stream) {"{"}
                    </motion.div>
                  </div>
                  <div className="text-muted-foreground">
                    4{" "}
                    <span className="text-muted-foreground">
                      // semantic refinement in progress...
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    5 result.push(await transform(chunk));
                  </div>
                  <div className="text-muted-foreground">6 {"}"}</div>
                  <div className="text-muted-foreground">
                    7 <span className="text-primary">return</span> result;
                  </div>
                  <div className="text-muted-foreground">8 {"}"}</div>
                </div>

                {/* telemetry overlay */}
                <div className="mt-8 pt-6 border-t border-border/40">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
                    <span>Behavioral Signals</span>
                    <span>Confidence: 94%</span>
                  </div>
                  <div className="h-12 flex items-end gap-1">
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-cyan-glow/40 rounded-t-[1px]"
                        animate={{
                          height: [`${10 + Math.random() * 90}%`, `${10 + Math.random() * 90}%`],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* decoration */}
            <div className="absolute -top-6 -right-6 h-32 w-32 bg-primary/20 blur-3xl animate-pulse" />
            <div
              className="absolute -bottom-6 -left-6 h-32 w-32 bg-accent/20 blur-3xl animate-pulse"
              style={{ animationDelay: "-1s" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Solution() {
  const items = [
    {
      icon: Fingerprint,
      title: "Cognitive Coding Signature",
      desc: "A unique behavioral fingerprint built from typing rhythm, pause patterns, and edit topology — verifying who is actually thinking through the problem.",
    },
    {
      icon: Waves,
      title: "Semantic Evolution Tracking",
      desc: "Watch the solution emerge: from scaffolding to refactor to insight. We model the trajectory, not just the output.",
    },
    {
      icon: ShieldCheck,
      title: "Integrity-Aware Analytics",
      desc: "Evidence-grade signals recruiters can defend — built on behavior, not surveillance.",
    },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div {...fadeUp} className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.22em] text-accent">The platform</div>
          <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
            Behavioral intelligence instead of surveillance.
          </h2>
        </motion.div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="glass-strong group relative overflow-hidden rounded-3xl p-7"
            >
              <div
                className="absolute -top-16 -right-16 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-60"
                style={{ background: "var(--gradient-primary)" }}
              />
              <div className="relative">
                <div
                  className="grid h-12 w-12 place-items-center rounded-xl text-primary-foreground shadow-glow"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <it.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-sm text-primary">
                  Explore module <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Candidate codes", d: "Standard editor experience. Zero friction." },
    { n: "02", t: "Telemetry captured", d: "Keystroke dynamics, edit topology, semantic state." },
    { n: "03", t: "Behavioral analysis", d: "Cognitive flow, anomalies, signature drift." },
    { n: "04", t: "Recruiter insights", d: "Evidence-grade summary and replay." },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div {...fadeUp} className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-glow">Pipeline</div>
          <h2 className="mt-3 text-3xl font-semibold md:text-5xl">How it works.</h2>
        </motion.div>
        <div className="relative mt-14">
          {/* Animated connection line */}
          <div className="absolute left-0 right-0 top-8 hidden h-px md:block overflow-hidden">
            <div
              className="w-full h-full animate-grid-flow"
              style={{
                background:
                  "linear-gradient(90deg, transparent, color-mix(in oklch, var(--electric) 60%, transparent), color-mix(in oklch, var(--violet-glow) 60%, transparent), transparent)",
                backgroundSize: "200% 100%",
              }}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="relative group"
              >
                <div
                  className="relative z-10 mx-auto grid h-16 w-16 place-items-center rounded-2xl text-sm font-semibold shadow-glow transition-transform group-hover:scale-110"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {s.n}
                  <div className="absolute inset-0 rounded-2xl animate-ping opacity-20 bg-primary" />
                </div>
                <div className="glass mt-5 rounded-2xl p-5 text-center transition-all group-hover:border-primary/50 group-hover:bg-primary/5">
                  <div className="font-semibold">{s.t}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{s.d}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: Activity,
      title: "Real-time Telemetry",
      d: "Sub-15ms streaming of behavioral signals at scale.",
    },
    {
      icon: AlertTriangle,
      title: "Logic Leap Detection",
      d: "Detects sudden, unearned jumps in semantic complexity.",
    },
    {
      icon: LineChart,
      title: "Replay Timeline",
      d: "Scrub the full session — every keystroke, pause, and refactor.",
    },
    {
      icon: Layers,
      title: "Refactor Heatmaps",
      d: "See where engineering effort actually concentrated.",
    },
    { icon: Gauge, title: "Confidence Scoring", d: "A defensible authenticity score per session." },
    {
      icon: Lock,
      title: "Privacy-First Monitoring",
      d: "Behavior-only. No webcam. No screen capture.",
    },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div {...fadeUp} className="flex max-w-3xl flex-col">
          <div className="text-xs uppercase tracking-[0.22em] text-primary">Capabilities</div>
          <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
            A full intelligence layer for technical hiring.
          </h2>
        </motion.div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className="glass group relative overflow-hidden rounded-2xl p-6"
            >
              <div
                className="absolute inset-x-0 -top-px h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, color-mix(in oklch, var(--electric) 80%, transparent), transparent)",
                }}
              />
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary/60 text-primary">
                  <it.icon className="h-5 w-5" />
                </div>
                <div className="font-semibold">{it.title}</div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{it.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Privacy() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          {...fadeUp}
          className="glass-strong relative overflow-hidden rounded-3xl p-8 md:p-12"
        >
          <div
            className="absolute inset-0 -z-10 opacity-50"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1 text-xs">
                <Lock className="h-3.5 w-3.5 text-success" /> Privacy first
              </div>
              <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
                No webcams. No surveillance. Just signal.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Technical Integrity Guard observes only the behavior required to evaluate authentic
                engineering ability. No video, no screen capture, no biometric profiling.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  i: Webcam,
                  t: "No webcam monitoring",
                  d: "Zero video frames captured or stored.",
                },
                {
                  i: EyeOff,
                  t: "No invasive surveillance",
                  d: "No keystroke logging of content outside the editor.",
                },
                {
                  i: ShieldCheck,
                  t: "Privacy-first architecture",
                  d: "All telemetry is anonymized and ephemeral.",
                },
                {
                  i: Eye,
                  t: "Behavior-only analysis",
                  d: "Patterns of thought — never personal identity.",
                },
              ].map((c) => (
                <div key={c.t} className="rounded-2xl border border-border/60 bg-background/30 p-4">
                  <c.i className="h-4 w-4 text-success" />
                  <div className="mt-2 font-semibold">{c.t}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{c.d}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <motion.h2 {...fadeUp} className="text-4xl font-semibold md:text-6xl">
          The future of technical hiring <span className="text-gradient">starts here.</span>
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.05 }}
          className="mx-auto mt-5 max-w-2xl text-muted-foreground"
        >
          Move beyond pass/fail. Hire on cognitive evidence.
        </motion.p>
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Link
            to="/interview"
            className="rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
            style={{ background: "var(--gradient-primary)" }}
          >
            Start Demo
          </Link>
          <Link
            to="/dashboard"
            className="rounded-xl border border-border/70 bg-secondary/40 px-6 py-3 text-sm font-semibold hover:bg-secondary"
          >
            See Analytics
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs text-muted-foreground md:flex-row">
        <div>
          © {new Date().getFullYear()} Technical Integrity Guard — Behavioral engineering
          intelligence.
        </div>
        <div className="flex gap-4">
          <a className="hover:text-foreground">Privacy</a>
          <a className="hover:text-foreground">Security</a>
          <a className="hover:text-foreground">Contact</a>
        </div>
      </div>
    </footer>
  );
}
