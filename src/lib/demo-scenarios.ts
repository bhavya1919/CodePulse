import { BehavioralSession, TelemetryEvent } from "./telemetry-store";

const startTime = Date.now() - 3600000; // 1 hour ago

export const DEMO_SCENARIOS = {
  STRONG_ENGINEER: {
    candidateName: "Bhargav G.",
    startTime,
    metrics: {
      wpm: 68,
      continuity: 94.2,
      wpmHistory: [45, 52, 58, 62, 65, 68, 66],
      continuityHistory: [88, 90, 92, 94, 94, 95, 94],
    },
    events: [
      { time: startTime + 1000, type: "typing", len: 45, delta: 45, label: "Initial scaffolding" },
      {
        time: startTime + 300000,
        type: "execution",
        len: 120,
        delta: 0,
        label: "Logic validation",
      },
      {
        time: startTime + 600000,
        type: "refactor",
        len: 150,
        delta: 30,
        label: "Iterative optimization",
      },
      {
        time: startTime + 1200000,
        type: "typing",
        len: 240,
        delta: 90,
        label: "Edge case handling",
      },
      {
        time: startTime + 1800000,
        type: "execution",
        len: 245,
        delta: 0,
        label: "Success criteria met",
      },
    ],
    snapshots: [
      {
        time: startTime + 1000,
        code: "function solve(nums, target) {\n  const map = new Map();\n  for(let i=0; i<nums.length; i++) {\n    // Initial setup\n  }\n}",
        label: "Initial Scaffold",
        desc: "Candidate establishes basic data structures and iteration logic.",
      },
      {
        time: startTime + 600000,
        code: "function solve(nums, target) {\n  const map = new Map();\n  for(let i=0; i<nums.length; i++) {\n    const complement = target - nums[i];\n    if(map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n}",
        label: "Optimization Phase",
        desc: "Transition from brute-force thinking to O(n) hash-map lookup.",
      },
      {
        time: startTime + 1800000,
        code: "/**\n * Optimized Two Sum implementation\n * Complexity: O(n) time, O(n) space\n */\nfunction solve(nums, target) {\n  const map = new Map();\n  for(let i=0; i<nums.length; i++) {\n    const diff = target - nums[i];\n    if(map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}",
        label: "Final Refinement",
        desc: "Adding documentation and handling null cases. High semantic stability.",
      },
    ],
  } as BehavioralSession,

  AI_ASSISTED: {
    candidateName: "Unknown Session",
    startTime,
    metrics: {
      wpm: 142,
      continuity: 32.4,
      wpmHistory: [0, 0, 180, 240, 0, 0, 0],
      continuityHistory: [100, 100, 20, 15, 10, 10, 10],
    },
    events: [
      { time: startTime + 1000, type: "typing", len: 20, delta: 20, label: "Initial pause" },
      {
        time: startTime + 30000,
        type: "paste",
        len: 450,
        delta: 430,
        label: "High-volume insertion cluster",
      },
      {
        time: startTime + 40000,
        type: "execution",
        len: 450,
        delta: 0,
        label: "Immediate execution",
      },
    ],
    snapshots: [
      {
        time: startTime + 1000,
        code: "function solve() {\n  \n}",
        label: "Initial State",
        desc: "Brief pause before significant code mutation.",
      },
      {
        time: startTime + 30000,
        code: '/**\n * Auto-generated boilerplate\n */\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        throw new IllegalArgumentException("No two sum solution");\n    }\n}',
        label: "Semantic Leap",
        desc: "Bulk insertion of 400+ characters detected. Unrealistic cognitive evolution.",
      },
    ],
  } as BehavioralSession,

  BALANCED: {
    candidateName: "Sarah Chen",
    startTime,
    metrics: {
      wpm: 42,
      continuity: 76.8,
      wpmHistory: [30, 35, 40, 38, 42, 45, 42],
      continuityHistory: [70, 72, 75, 74, 76, 78, 77],
    },
    events: [
      { time: startTime + 1000, type: "typing", len: 30, delta: 30, label: "Exploration" },
      { time: startTime + 300000, type: "typing", len: 80, delta: 50, label: "Debugging loop" },
      {
        time: startTime + 900000,
        type: "execution",
        len: 80,
        delta: 0,
        label: "Syntax error detected",
      },
      { time: startTime + 1200000, type: "typing", len: 140, delta: 60, label: "Resolution" },
    ],
    snapshots: [
      {
        time: startTime + 1000,
        code: "def solve(nums, target):\n    # Need to iterate...",
        label: "Initial Scaffold",
        desc: "Thinking through iterative approach.",
      },
      {
        time: startTime + 1200000,
        code: "def solve(nums, target):\n    d = {}\n    for i, n in enumerate(nums):\n        if target - n in d:\n            return [d[target - n], i]\n        d[n] = i\n    return []",
        label: "Iterative Build",
        desc: "Typical debugging and refinement flow observed.",
      },
    ],
  } as BehavioralSession,
};
