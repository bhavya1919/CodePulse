// Simple shared state for behavioral session data
// In a real app, this would be a backend/socket stream

export interface TelemetryEvent {
  type:
    | "typing"
    | "refactor"
    | "pause"
    | "execution"
    | "paste"
    | "burst"
    | "anomaly"
    | "tabSwitch"
    | "delete"
    | "disconnect"
    | "submission"
    | "evaluation";
  time: number;
  label?: string;
  desc?: string;
  pos?: { line: number; ch: number };
  len?: number;
  delta?: number; // Change in code length
  code?: string;
}

export interface SessionSnapshot {
  code: string;
  time: number;
  label: string;
  desc: string;
}

export interface BehavioralSession {
  id: string;
  candidateName: string;
  language: string;
  startTime: number;
  metrics: {
    wpm: number;
    refactor: number;
    pause: number;
    continuity: number;
    wpmHistory: number[];
    continuityHistory: number[];
    typingRhythm?: number; // Variance in keystroke timing
    refactorDensity?: number; // Ratio of refactoring events
    pauseDensity?: number; // Ratio of idle time
    semanticContinuity?: number; // Refined continuity score
  };
  events: TelemetryEvent[];
  snapshots: SessionSnapshot[];
}

const STORAGE_KEY = "tig_behavioral_session";
const HISTORY_KEY = "tig_behavioral_history";

export const TelemetryStore = {
  saveSession: (session: BehavioralSession) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));

    // Also update history
    try {
      const historyRaw = localStorage.getItem(HISTORY_KEY);
      const history: BehavioralSession[] = historyRaw ? JSON.parse(historyRaw) : [];
      const index = history.findIndex((s) => s.id === session.id);
      if (index !== -1) {
        history[index] = session;
      } else {
        history.push(session);
      }
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-10))); // keep last 10
    } catch (e) {
      console.error("Failed to update session history", e);
    }
  },

  getSession: (): BehavioralSession | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  getAllSessions: (): BehavioralSession[] => {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  clearSession: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Update live metrics for dashboard sync
  updateLiveMetrics: (metrics: BehavioralSession["metrics"]) => {
    const session = TelemetryStore.getSession();
    if (session) {
      session.metrics = metrics;
      TelemetryStore.saveSession(session);
    }
  },

  loadScenario: (session: BehavioralSession) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    // Also save to history for reports
    const historyRaw = localStorage.getItem(HISTORY_KEY);
    const history: BehavioralSession[] = historyRaw ? JSON.parse(historyRaw) : [];
    if (!history.find((s) => s.id === session.id)) {
      history.push(session);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
    window.dispatchEvent(new Event("storage"));
  },
};
