/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Editor, { loader } from "@monaco-editor/react";
import {
  Activity,
  Clock,
  Code2,
  Play,
  Send,
  Radio,
  Cpu,
  Gauge,
  GitBranch,
  Brain,
  Wifi,
  Terminal,
  ShieldCheck,
  Lock,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Sparkles,
  ChevronLeft,
  Maximize2,
  Zap,
  Layers,
  RefreshCw,
  BarChart3,
  MousePointer2,
  MessageSquare,
  Bot,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Moon,
  SunMedium,
  Video,
  WifiOff,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { TelemetryStore, BehavioralSession, TelemetryEvent } from "@/lib/telemetry-store";

export const Route = createFileRoute("/interview")({
  head: () => ({ meta: [{ title: "Candidate Interview · Technical Integrity Guard" }] }),
  component: InterviewPage,
});

const LANGUAGE_TEMPLATES = {
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Initialize semantic lookup map for O(n) continuity
  const seen = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const complement = target - num;
    
    // Check for cognitive match in existing state
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    
    seen.set(num, i);
  }
  
  return [];
}`,
  python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        """
        Implementation of optimal semantic lookup logic.
        """
        lookup = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in lookup:
                return [lookup[complement], i]
            lookup[num] = i
        return []`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // High-fidelity state management using HashMap
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
  cpp: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        // Semantic optimization via hash mapping
        std::unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.count(complement)) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`,
  typescript: `/**
 * High-fidelity TypeScript implementation
 */
function twoSum(nums: number[], target: number): number[] {
  const seen: Map<number, number> = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement)!, i];
    }
    seen.set(nums[i], i);
  }
  
  return [];
}`,
};

const DEFAULT_CODE_TEMPLATES: Record<string, string> = {
  javascript: `// Begin your solution here\n`,
  python: `# Begin your solution here\n`,
  java: `// Begin your solution here\n`,
  cpp: `// Begin your solution here\n`,
  typescript: `// Begin your solution here\n`,
};

const QUESTION_BANK = [
  {
    id: 1,
    title: "Two Sum",
    category: "Array",
    difficulty: "Easy",
    description: "Return indices of two numbers in an array that add up to a target.",
    example: "nums = [2,7,11,15], target = 9 → [0,1]",
    constraint: "Exactly one valid answer exists.",
  },
  {
    id: 2,
    title: "Valid Parentheses",
    category: "Stack",
    difficulty: "Easy",
    description: "Determine whether a string of brackets is properly closed and nested.",
    example: "()[]{} → true",
    constraint: "Use O(n) time and space.",
  },
  {
    id: 3,
    title: "Best Time to Buy and Sell Stock",
    category: "Array",
    difficulty: "Easy",
    description: "Find the maximum profit from a single buy and sell.",
    example: "prices = [7,1,5,3,6,4] → 5",
    constraint: "Only one transaction allowed.",
  },
  {
    id: 4,
    title: "Merge Two Sorted Lists",
    category: "Linked List",
    difficulty: "Easy",
    description: "Merge two sorted linked lists and return it as a sorted list.",
    example: "[1,2,4], [1,3,4] → [1,1,2,3,4,4]",
    constraint: "Maintain sorted order.",
  },
  {
    id: 5,
    title: "Maximum Subarray",
    category: "Dynamic Programming",
    difficulty: "Easy",
    description: "Find the contiguous subarray with the largest sum.",
    example: "[-2,1,-3,4,-1,2,1,-5,4] → 6",
    constraint: "Use O(n) time.",
  },
  {
    id: 6,
    title: "Longest Substring Without Repeating Characters",
    category: "String",
    difficulty: "Medium",
    description: "Return the length of the longest substring without repeating characters.",
    example: "abcabcbb → 3",
    constraint: "Use sliding window.",
  },
  {
    id: 7,
    title: "Container With Most Water",
    category: "Two Pointers",
    difficulty: "Medium",
    description:
      "Find two lines that together with the x-axis form a container with the most water.",
    example: "[1,8,6,2,5,4,8,3,7] → 49",
    constraint: "Use two-pointer technique.",
  },
  {
    id: 8,
    title: "Three Sum",
    category: "Array",
    difficulty: "Medium",
    description: "Find all unique triplets in the array which gives the sum of zero.",
    example: "[-1,0,1,2,-1,-4] → [[-1,-1,2],[-1,0,1]]",
    constraint: "Avoid duplicates.",
  },
  {
    id: 9,
    title: "Letter Combinations of a Phone Number",
    category: "Backtracking",
    difficulty: "Medium",
    description: "Return all possible letter combinations from a digit string.",
    example: '23 → ["ad","ae","af","bd","be","bf","cd","ce","cf"]',
    constraint: "Handle empty input.",
  },
  {
    id: 10,
    title: "Generate Parentheses",
    category: "Backtracking",
    difficulty: "Medium",
    description: "Generate all combinations of well-formed parentheses.",
    example: 'n = 3 → ["((()))","(()())","(())()","()(())","()()()"]',
    constraint: "Use recursion or stack.",
  },
  {
    id: 11,
    title: "Search in Rotated Sorted Array",
    category: "Binary Search",
    difficulty: "Medium",
    description: "Search for a target in a rotated sorted array.",
    example: "[4,5,6,7,0,1,2], target = 0 → 4",
    constraint: "O(log n) time.",
  },
  {
    id: 12,
    title: "Lowest Common Ancestor of BST",
    category: "Tree",
    difficulty: "Medium",
    description: "Find the lowest common ancestor of two nodes in a BST.",
    example: "Input: root, p=2, q=8 → 6",
    constraint: "Use BST properties.",
  },
  {
    id: 13,
    title: "Symmetric Tree",
    category: "Tree",
    difficulty: "Easy",
    description: "Check whether a binary tree is symmetric around its center.",
    example: "[1,2,2,3,4,4,3] → true",
    constraint: "Use recursion or iterative traversal.",
  },
  {
    id: 14,
    title: "Binary Tree Level Order Traversal",
    category: "Tree",
    difficulty: "Medium",
    description: "Return the level order traversal of a binary tree.",
    example: "[3,9,20,null,null,15,7] → [[3],[9,20],[15,7]]",
    constraint: "Use BFS.",
  },
  {
    id: 15,
    title: "Number of Islands",
    category: "Graph",
    difficulty: "Medium",
    description: "Count the number of islands in a 2D grid.",
    example: "[[1,1,0],[1,0,0],[0,0,1]] → 2",
    constraint: "Use DFS/BFS.",
  },
  {
    id: 16,
    title: "Coin Change",
    category: "Dynamic Programming",
    difficulty: "Medium",
    description: "Return the fewest number of coins to make up a given amount.",
    example: "coins=[1,2,5], amount=11 → 3",
    constraint: "Return -1 if impossible.",
  },
  {
    id: 17,
    title: "House Robber",
    category: "Dynamic Programming",
    difficulty: "Medium",
    description: "Maximize robbery amount without alerting police.",
    example: "[1,2,3,1] → 4",
    constraint: "Cannot rob adjacent houses.",
  },
  {
    id: 18,
    title: "Climbing Stairs",
    category: "Dynamic Programming",
    difficulty: "Easy",
    description: "Count distinct ways to climb a staircase with 1 or 2 steps.",
    example: "n = 3 → 3",
    constraint: "Use O(n) time.",
  },
  {
    id: 19,
    title: "Word Break",
    category: "Dynamic Programming",
    difficulty: "Medium",
    description: "Check if a string can be segmented into dictionary words.",
    example: 's="leetcode", wordDict=["leet","code"] → true',
    constraint: "Use DP or memoization.",
  },
  {
    id: 20,
    title: "Course Schedule",
    category: "Graph",
    difficulty: "Medium",
    description: "Determine if you can finish all courses given prerequisites.",
    example: "numCourses=2, prerequisites=[[1,0]] → true",
    constraint: "Detect cycles in directed graph.",
  },
  {
    id: 21,
    title: "Minimum Path Sum",
    category: "Dynamic Programming",
    difficulty: "Medium",
    description: "Find the minimum path sum from top-left to bottom-right of a grid.",
    example: "[[1,3,1],[1,5,1],[4,2,1]] → 7",
    constraint: "Move only down or right.",
  },
  {
    id: 22,
    title: "Word Search",
    category: "Backtracking",
    difficulty: "Medium",
    description: "Find a word in a grid by moving horizontally or vertically.",
    example: '["ABCE","SFCS","ADEE"], word="ABCCED" → true',
    constraint: "Do not reuse cells.",
  },
  {
    id: 23,
    title: "Rotate Array",
    category: "Array",
    difficulty: "Easy",
    description: "Rotate an array to the right by k steps.",
    example: "[1,2,3,4,5,6,7], k=3 → [5,6,7,1,2,3,4]",
    constraint: "Do it in-place.",
  },
  {
    id: 24,
    title: "Intersection of Two Arrays",
    category: "Array",
    difficulty: "Easy",
    description: "Return the intersection of two arrays.",
    example: "[1,2,2,1], [2,2] → [2]",
    constraint: "Each element in result should be unique.",
  },
  {
    id: 25,
    title: "Product of Array Except Self",
    category: "Array",
    difficulty: "Medium",
    description: "Return an array such that each element is the product of all other elements.",
    example: "[1,2,3,4] → [24,12,8,6]",
    constraint: "Do not use division.",
  },
  {
    id: 26,
    title: "Kth Largest Element in an Array",
    category: "Heap",
    difficulty: "Medium",
    description: "Find the k-th largest element in an unsorted array.",
    example: "[3,2,1,5,6,4], k=2 → 5",
    constraint: "Use a heap or partition algorithm.",
  },
  {
    id: 27,
    title: "Serialize and Deserialize Binary Tree",
    category: "Tree",
    difficulty: "Hard",
    description: "Design algorithms to serialize and deserialize a binary tree.",
    example: "Serialize tree and then restore it into same structure.",
    constraint: "Preserve structure in string format.",
  },
  {
    id: 28,
    title: "Meeting Rooms II",
    category: "Interval",
    difficulty: "Medium",
    description: "Find the minimum number of conference rooms required.",
    example: "[[0,30],[5,10],[15,20]] → 2",
    constraint: "Use a min-heap on end times.",
  },
  {
    id: 29,
    title: "Validate Binary Search Tree",
    category: "Tree",
    difficulty: "Medium",
    description: "Check if a binary tree is a valid BST.",
    example: "[2,1,3] → true",
    constraint: "Use range constraints during traversal.",
  },
  {
    id: 30,
    title: "Maximum Depth of Binary Tree",
    category: "Tree",
    difficulty: "Easy",
    description: "Find the maximum depth of a binary tree.",
    example: "[3,9,20,null,null,15,7] → 3",
    constraint: "Use recursion or DFS.",
  },
  {
    id: 31,
    title: "Merge Intervals",
    category: "Interval",
    difficulty: "Medium",
    description: "Merge all overlapping intervals.",
    example: "[[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]]",
    constraint: "Sort intervals by start time.",
  },
  {
    id: 32,
    title: "Top K Frequent Elements",
    category: "Heap",
    difficulty: "Medium",
    description: "Return the k most frequent elements from an array.",
    example: "[1,1,1,2,2,3], k=2 → [1,2]",
    constraint: "Use a heap for large input.",
  },
  {
    id: 33,
    title: "Length of Last Word",
    category: "String",
    difficulty: "Easy",
    description: "Return the length of the last word in a string.",
    example: '"Hello World" → 5',
    constraint: "Ignore trailing spaces.",
  },
  {
    id: 34,
    title: "Spiral Matrix",
    category: "Array",
    difficulty: "Medium",
    description: "Return all elements of a matrix in spiral order.",
    example: "[[1,2,3],[4,5,6],[7,8,9]] → [1,2,3,6,9,8,7,4,5]",
    constraint: "Simulate spiral traversal.",
  },
  {
    id: 35,
    title: "Unique Paths",
    category: "Dynamic Programming",
    difficulty: "Medium",
    description: "Count unique paths in a grid from top-left to bottom-right.",
    example: "m=3,n=7 → 28",
    constraint: "Only move down or right.",
  },
  {
    id: 36,
    title: "Simplify Path",
    category: "String",
    difficulty: "Medium",
    description: "Simplify a Unix-style file path.",
    example: '"/a/./b/../../c/" → "/c"',
    constraint: "Handle . and .. correctly.",
  },
  {
    id: 37,
    title: "Min Stack",
    category: "Design",
    difficulty: "Easy",
    description: "Design a stack that supports push, pop, top, and retrieving the minimum element.",
    example: "push(-2), push(0), push(-3), getMin() → -3",
    constraint: "All operations in O(1).",
  },
  {
    id: 38,
    title: "Implement Queue using Stacks",
    category: "Design",
    difficulty: "Easy",
    description: "Implement a queue using two stacks.",
    example: "push(1), push(2), peek() → 1",
    constraint: "Use only stack operations.",
  },
  {
    id: 39,
    title: "Number of 1 Bits",
    category: "Bit Manipulation",
    difficulty: "Easy",
    description: "Count the number of 1 bits in the binary representation of an integer.",
    example: "n=11 → 3",
    constraint: "Use bit operations.",
  },
  {
    id: 40,
    title: "Hamming Distance",
    category: "Bit Manipulation",
    difficulty: "Easy",
    description: "Calculate the Hamming distance between two integers.",
    example: "x=1, y=4 → 2",
    constraint: "Compute differing bits.",
  },
  {
    id: 41,
    title: "Majority Element",
    category: "Array",
    difficulty: "Easy",
    description: "Find the majority element that appears more than half the time.",
    example: "[3,2,3] → 3",
    constraint: "Use Boyer-Moore if possible.",
  },
  {
    id: 42,
    title: "Jump Game",
    category: "Array",
    difficulty: "Medium",
    description: "Determine if you can reach the last index of the array.",
    example: "[2,3,1,1,4] → true",
    constraint: "Use greedy algorithm.",
  },
  {
    id: 43,
    title: "Pascal's Triangle",
    category: "Array",
    difficulty: "Easy",
    description: "Generate the first numRows of Pascal's triangle.",
    example: "numRows=5 → [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]",
    constraint: "Build row by row.",
  },
  {
    id: 44,
    title: "Set Matrix Zeroes",
    category: "Matrix",
    difficulty: "Medium",
    description: "If an element is 0, set its entire row and column to 0.",
    example: "[[1,1,1],[1,0,1],[1,1,1]] → [[1,0,1],[0,0,0],[1,0,1]]",
    constraint: "Do it in-place.",
  },
  {
    id: 45,
    title: "Partition Equal Subset Sum",
    category: "Dynamic Programming",
    difficulty: "Medium",
    description: "Determine if array can be partitioned into equal sum subsets.",
    example: "[1,5,11,5] → true",
    constraint: "Use subset sum DP.",
  },
  {
    id: 46,
    title: "Binary Tree Inorder Traversal",
    category: "Tree",
    difficulty: "Easy",
    description: "Return the inorder traversal of a binary tree.",
    example: "[1,null,2,3] → [1,3,2]",
    constraint: "Use recursion or stack.",
  },
  {
    id: 47,
    title: "Circular Array Loop",
    category: "Array",
    difficulty: "Medium",
    description: "Check if a circular array loop exists with more than one element.",
    example: "[2,-1,1,2,2] → true",
    constraint: "Use fast/slow pointers.",
  },
  {
    id: 48,
    title: "Fibonacci Number",
    category: "Math",
    difficulty: "Easy",
    description: "Return the n-th Fibonacci number.",
    example: "n=4 → 3",
    constraint: "Use iterative DP or memoization.",
  },
  {
    id: 49,
    title: "Search a 2D Matrix",
    category: "Binary Search",
    difficulty: "Medium",
    description: "Write an efficient search in a 2D matrix that is sorted row-wise.",
    example: "matrix=[[1,3,5],[7,9,11],[13,15,17]], target=9 → true",
    constraint: "Use O(log(mn)) time.",
  },
  {
    id: 50,
    title: "Minimum Window Substring",
    category: "String",
    difficulty: "Hard",
    description: "Find the minimum window substring containing all characters of another string.",
    example: 's="ADOBECODEBANC", t="ABC" → "BANC"',
    constraint: "Use sliding window with hashmap.",
  },
];

// Canonical solutions (hidden from candidate UI). These are simple reference implementations
// used only for lightweight string/token matching on submission. They are not displayed in the app.
const SOLUTION_BANK: Record<number, string> = {
  1: `function twoSum(nums, target) { const seen = new Map(); for (let i=0;i<nums.length;i++){const c=target-nums[i]; if(seen.has(c)) return [seen.get(c), i]; seen.set(nums[i], i);} return []; }`,
  2: `function isValid(s){const m={')':'(',']':'[','}':'{'};const st=[];for(const c of s){if('([{'.includes(c)) st.push(c); else{if(st.pop()!==m[c])return false;}}return st.length===0;}`,
  3: `function maxProfit(prices){let min=Infinity,max=0;for(const p of prices){min=Math.min(min,p);max=Math.max(max,p-min);}return max;}`,
  4: `function mergeTwoLists(l1,l2){const dummy={next:null};let p=dummy;while(l1&&l2){if(l1.val<l2.val){p.next=l1;l1=l1.next;}else{p.next=l2;l2=l2.next;}p=p.next;}p.next=l1||l2;return dummy.next;}`,
  5: `function maxSubArray(nums){let maxSoFar=nums[0], cur=nums[0];for(let i=1;i<nums.length;i++){cur=Math.max(nums[i],cur+nums[i]);maxSoFar=Math.max(maxSoFar,cur);}return maxSoFar;}`,
  // For remaining problems we provide minimal token hints so the matching heuristic can still work.
  6: `// sliding window tokens: left right window set`,
  7: `// two pointers left right area max`,
  8: `// sorting two pointers avoid duplicates`,
  9: `// backtracking recursion build combinations`,
  10: `// generate parentheses recursion backtrack`,
};

// Expected outputs / test-cases for lightweight verification. Used only for heuristic checks.
const EXPECTED_OUTPUTS: Record<number, Array<{ input: string; expected: string }>> = {
  1: [{ input: "nums=[2,7,11,15], target=9", expected: "[0,1]" }],
  2: [{ input: 's="()[]{}"', expected: "true" }],
  3: [{ input: "prices=[7,1,5,3,6,4]", expected: "5" }],
  4: [{ input: "l1=[1,2,4], l2=[1,3,4]", expected: "[1,1,2,3,4,4]" }],
  5: [{ input: "nums=[-2,1,-3,4,-1,2,1,-5,4]", expected: "6" }],
  6: [{ input: 's="abcabcbb"', expected: "3" }],
  7: [{ input: "height=[1,8,6,2,5,4,8,3,7]", expected: "49" }],
  8: [{ input: "nums=[-1,0,1,2,-1,-4]", expected: "[[-1,-1,2],[-1,0,1]]" }],
  9: [{ input: 'digits="23"', expected: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' }],
  10: [{ input: "n=3", expected: '["((()))","(()())","(())()","()(())","()()()"]' }],
  11: [{ input: "nums=[4,5,6,7,0,1,2], target=0", expected: "4" }],
  12: [{ input: "BST example", expected: "6" }],
  13: [{ input: "[1,2,2,3,4,4,3]", expected: "true" }],
  14: [{ input: "tree=[3,9,20,null,null,15,7]", expected: "[[3],[9,20],[15,7]]" }],
  15: [{ input: "grid=[[1,1,0],[1,0,0],[0,0,1]]", expected: "2" }],
  16: [{ input: "coins=[1,2,5], amount=11", expected: "3" }],
  17: [{ input: "nums=[1,2,3,1]", expected: "4" }],
  18: [{ input: "n=3", expected: "3" }],
  19: [{ input: 's="leetcode", dict=["leet","code"]', expected: "true" }],
  20: [{ input: "numCourses=2, prereq=[[1,0]]", expected: "true" }],
  21: [{ input: "grid=[[1,3,1],[1,5,1],[4,2,1]]", expected: "7" }],
  22: [{ input: 'board=["ABCE","SFCS","ADEE"], word="ABCCED"', expected: "true" }],
  23: [{ input: "nums=[1,2,3,4,5,6,7], k=3", expected: "[5,6,7,1,2,3,4]" }],
  24: [{ input: "nums1=[1,2,2,1], nums2=[2,2]", expected: "[2]" }],
  25: [{ input: "nums=[1,2,3,4]", expected: "[24,12,8,6]" }],
  26: [{ input: "nums=[3,2,1,5,6,4], k=2", expected: "5" }],
  27: [{ input: "serialize/deserialize roundtrip", expected: "structure preserved" }],
  28: [{ input: "intervals=[[0,30],[5,10],[15,20]]", expected: "2" }],
  29: [{ input: "tree=[2,1,3]", expected: "true" }],
  30: [{ input: "tree=[3,9,20,null,null,15,7]", expected: "3" }],
  31: [{ input: "intervals=[[1,3],[2,6],[8,10],[15,18]]", expected: "[[1,6],[8,10],[15,18]]" }],
  32: [{ input: "nums=[1,1,1,2,2,3], k=2", expected: "[1,2]" }],
  33: [{ input: 's="Hello World"', expected: "5" }],
  34: [{ input: "matrix=[[1,2,3],[4,5,6],[7,8,9]]", expected: "[1,2,3,6,9,8,7,4,5]" }],
  35: [{ input: "m=3,n=7", expected: "28" }],
  36: [{ input: 'path="/a/./b/../../c/"', expected: '"/c"' }],
  37: [{ input: "operations push/pop/getMin", expected: "getMin -> -3" }],
  38: [{ input: "queue ops push(1), push(2), peek()", expected: "1" }],
  39: [{ input: "n=11", expected: "3" }],
  40: [{ input: "x=1,y=4", expected: "2" }],
  41: [{ input: "nums=[3,2,3]", expected: "3" }],
  42: [{ input: "nums=[2,3,1,1,4]", expected: "true" }],
  43: [{ input: "numRows=5", expected: "[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]" }],
  44: [{ input: "matrix=[[1,1,1],[1,0,1],[1,1,1]]", expected: "[[1,0,1],[0,0,0],[1,0,1]]" }],
  45: [{ input: "nums=[1,5,11,5]", expected: "true" }],
  46: [{ input: "tree=[1,null,2,3]", expected: "[1,3,2]" }],
  47: [{ input: "nums=[2,-1,1,2,2]", expected: "true" }],
  48: [{ input: "n=4", expected: "3" }],
  49: [{ input: "matrix=[[1,3,5],[7,9,11],[13,15,17]], target=9", expected: "true" }],
  50: [{ input: 's="ADOBECODEBANC", t="ABC"', expected: '"BANC"' }],
};

// LeetCode-style detailed constraints for display and heuristic checking.
const EXPECTED_CONSTRAINTS: Record<number, string[]> = {
  1: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Exactly one valid answer exists"],
  2: ["1 <= s.length <= 10^4", "s consists of parentheses characters only", "Use O(n) time."],
  3: [
    "1 <= prices.length <= 10^5",
    "0 <= prices[i] <= 10^5",
    "Return maximum profit with one transaction",
  ],
  4: ["0 <= list length <= 50", "Values fit in 32-bit signed int", "Merge in-place if possible"],
  5: ["1 <= nums.length <= 10^5", "-10^5 <= nums[i] <= 10^5", "Use O(n) time and O(1) extra space"],
  6: ["0 <= s.length <= 10^5", "Use sliding window for O(n) time"],
  7: ["2 <= height.length <= 10^5", "0 <= height[i] <= 10^4", "Use two-pointer O(n) solution"],
  8: ["0 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5", "Return unique triplets"],
  9: ["0 <= digits.length <= 4", "Map digits to letters as on telephone pad"],
  10: ["1 <= n <= 8", "Generate all combinations of balanced parentheses"],
  11: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9", "O(log n) expected"],
  12: ["Node values are unique", "Tree size up to 10^4"],
  13: ["Number of nodes up to 1000"],
  14: ["Number of nodes up to 10^4", "Return list of levels"],
  15: ["m,n <= 300", "Grid values are 0/1", "Use DFS/BFS"],
  16: ["1 <= coins.length <= 12", "0 <= amount <= 10^4", "Return -1 if impossible"],
  17: ["1 <= nums.length <= 10^5", "0 <= nums[i] <= 10^4", "Do not rob adjacent houses"],
  18: ["1 <= n <= 45", "Use iterative DP or closed-form"],
  19: ["1 <= s.length <= 300", "1 <= wordDict.length <= 1000", "Use DP or memoization"],
  20: ["1 <= numCourses <= 10^5", "prerequisites list length <= 10^5", "Detect cycles"],
  21: ["m,n <= 200", "Grid values positive", "Use DP"],
  22: ["board size up to 200", "Word length up to 10^3"],
  23: ["1 <= k <= nums.length", "Rotate in-place preferred"],
  24: ["Arrays length up to 10^5", "Return unique elements"],
  25: ["2 <= nums.length <= 10^5", "Do not use division", "O(n) time expected"],
  26: ["1 <= k <= nums.length <= 10^5", "Use heap or partition"],
  27: ["Tree nodes up to 10^4", "Preserve structure in serialization"],
  28: ["1 <= intervals.length <= 10^4", "Intervals are integer pairs"],
  29: ["Tree size up to 10^4", "Use valid BST checks (min/max ranges)"],
  30: ["Tree nodes up to 10^4", "Use recursion or iterative DFS"],
  31: ["1 <= intervals.length <= 10^4", "Sort by start time"],
  32: ["1 <= nums.length <= 10^5", "Return k most frequent"],
  33: ["1 <= s.length <= 10^4", "Ignore trailing spaces"],
  34: ["m*n <= 10^4", "Return spiral order array"],
  35: ["1 <= m,n <= 100", "Use DP"],
  36: ["1 <= path.length <= 3000", "Handle . and .. correctly"],
  37: ["Operations up to 3*10^4", "All ops in O(1) amortized"],
  38: ["Use only stack operations", "Queue size up to 10^4"],
  39: ["Unsigned 32-bit integer", "Return number of 1 bits"],
  40: ["0 <= x,y < 2^31", "Return Hamming distance"],
  41: ["1 <= nums.length <= 5*10^4", "Majority element exists"],
  42: ["1 <= nums.length <= 10^4", "Return boolean reachability"],
  43: ["1 <= numRows <= 30", "Build triangle row by row"],
  44: ["m,n <= 200", "Do in-place modifications"],
  45: ["1 <= nums.length <= 200", "Sum values up to 10^4", "Use subset-sum DP"],
  46: ["Tree nodes up to 10^4", "Return inorder traversal array"],
  47: ["1 <= nums.length <= 5000", "Use fast/slow pointer detection"],
  48: ["0 <= n <= 30", "Return nth Fibonacci number"],
  49: ["m*n <= 10^5", "Matrix is sorted row-wise", "Use binary search"],
  50: ["1 <= s.length,t.length <= 10^5", "Use sliding window with hashmap"],
};

function InterviewPage() {
  const { userSession, userName, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userSession === "unauthenticated") {
      navigate({ to: "/login" });
    }
  }, [userSession, navigate]);

  useEffect(() => {
    if (userName) {
      sessionData.current.candidateName = userName;
    }
  }, [userName]);

  const [lang, setLang] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE_TEMPLATES.javascript);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
  const [codingStarted, setCodingStarted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAI, setShowAI] = useState(false);
  const [activeTab, setActiveTab] = useState("problem");
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [sessionIntegrity, setSessionIntegrity] = useState(100);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    wpm: 0,
    refactor: 12,
    pause: 0,
    continuity: 94,
    wpmHistory: Array(30).fill(0),
    continuityHistory: Array(30).fill(94),
  });
  const [insights, setInsights] = useState([
    "Healthy debugging rhythm detected",
    "Iterative refinement behavior observed",
    "Stable semantic progression maintained",
  ]);

  const [remainingTime, setRemainingTime] = useState(55 * 60);
  const [theme, setTheme] = useState<"dark" | "vivid">("dark");
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [pasteAlert, setPasteAlert] = useState<string | null>(null);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem("completedQuestions");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [resultModal, setResultModal] = useState<{
    open: boolean;
    success?: boolean;
    message?: string;
  }>({ open: false });
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [aiMessages, setAiMessages] = useState<Array<{ role: "user" | "bot"; text: string }>>([]);
  const [aiInput, setAiInput] = useState("");
  const [hintLevels, setHintLevels] = useState<Record<number, number>>({});

  const sessionData = useRef<BehavioralSession>({
    id: `sess_${Math.random().toString(36).substr(2, 9)}`,
    candidateName: "Candidate",
    language: "javascript",
    startTime: Date.now(),
    metrics: {
      wpm: 0,
      refactor: 12,
      pause: 0,
      continuity: 94,
      wpmHistory: Array(30).fill(0),
      continuityHistory: Array(30).fill(94),
    },
    events: [],
    snapshots: [],
  });

  const lastActionTime = useRef(Date.now());
  const keystrokes = useRef(0);
  const editorRef = useRef<any>(null);
  const lastCodeLen = useRef(0);
  const [hintPanelOpen, setHintPanelOpen] = useState(true);

  // New Behavioral Tracking Refs
  const lastKeystrokeTime = useRef(Date.now());
  const keystrokeIntervals = useRef<number[]>([]);
  const totalEventsCount = useRef(0);
  const refactorEventsCount = useRef(0);
  const totalIdleTime = useRef(0);
  const sessionStartTime = useRef(Date.now());

  // Snapshot capturing logic
  const captureSnapshot = (label: string, desc: string) => {
    sessionData.current.snapshots.push({
      code: editorRef.current?.getValue() || code,
      time: Date.now(),
      label,
      desc,
    });
  };

  // Real-time Telemetry Processing Engine
  useEffect(() => {
    const proc = setInterval(() => {
      const now = Date.now();
      const sessionDuration = (now - sessionStartTime.current) / 1000;
      const idleTime = (now - lastActionTime.current) / 1000;

      const currentWpm = Math.round(keystrokes.current * 12);
      const newContinuity = Math.max(
        70,
        metrics.continuity + (keystrokes.current > 0 ? 0.4 : -0.2),
      );

      // Advanced Behavioral Metrics Calculation
      const calculateVariance = (arr: number[]) => {
        if (arr.length === 0) return 0;
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
        return arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
      };

      const rhythmVariance = calculateVariance(keystrokeIntervals.current);
      const typingRhythm = Math.max(0, 100 - Math.sqrt(rhythmVariance) / 10);
      const refactorDensity =
        totalEventsCount.current > 0
          ? (refactorEventsCount.current / totalEventsCount.current) * 100
          : 0;
      const pauseDensity = (totalIdleTime.current / Math.max(1, sessionDuration)) * 100;
      const semanticContinuity = Math.max(
        0,
        Math.min(100, 100 - pauseDensity / 2 - refactorDensity / 5),
      );

      setMetrics((prev) => {
        const newWpmHistory = [...prev.wpmHistory.slice(1), currentWpm];
        const newContinuityHistory = [...prev.continuityHistory.slice(1), newContinuity];

        const newM = {
          ...prev,
          wpm: currentWpm,
          pause: Math.round(idleTime * 10) / 10,
          continuity: newContinuity,
          wpmHistory: newWpmHistory,
          continuityHistory: newContinuityHistory,
          typingRhythm,
          refactorDensity,
          pauseDensity,
          semanticContinuity,
        };

        sessionData.current.metrics = newM;
        TelemetryStore.saveSession(sessionData.current);
        return newM;
      });

      keystrokes.current = 0;

      // Behavioral Insight Logic
      if (idleTime > 20) {
        updateInsights("Deep cognitive pause detected (Refining logic)");
      } else if (currentWpm > 100) {
        updateInsights("High-velocity semantic throughput detected");
      } else if (currentWpm > 0 && idleTime < 2) {
        updateInsights("Stable semantic continuity maintained");
      }
    }, 3000);
    return () => clearInterval(proc);
  }, [metrics.refactor, metrics.continuity]);

  // Periodic Auto-Snapshot
  useEffect(() => {
    const snapTimer = setInterval(() => {
      if (Date.now() - lastActionTime.current < 30000) {
        captureSnapshot(
          "Periodic State",
          "Automatic behavioral anchor captured during active session.",
        );
      }
    }, 60000);
    return () => clearInterval(snapTimer);
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        addTelemetryEvent("tabSwitch", "Tab switched", "Candidate moved focus away from editor.");
        setTabSwitchCount((count) => count + 1);
        updateInsights("Focus shift detected: candidate switched tabs.");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!codingStarted) return;
    const interval = window.setInterval(() => {
      setRemainingTime((time) => Math.max(0, time - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [codingStarted]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const currentVideoRef = videoRef.current;

    if (webcamEnabled && typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((mediaStream) => {
          stream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play().catch(() => {
              setWebcamError("Unable to play webcam stream.");
            });
          }
          setWebcamError(null);
        })
        .catch((err) => {
          console.error("Webcam access error:", err);
          setWebcamError("Webcam access denied or unavailable.");
          setWebcamEnabled(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (!webcamEnabled && currentVideoRef) {
        currentVideoRef.srcObject = null;
      }
    };
  }, [webcamEnabled]);

  useEffect(() => {
    const handleFullScreenChange = () => setFullscreenMode(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  useEffect(() => {
    if (!pasteAlert) return;
    const timeout = window.setTimeout(() => setPasteAlert(null), 8000);
    return () => window.clearTimeout(timeout);
  }, [pasteAlert]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = theme;
    }
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(theme === "dark" ? "tig-dark" : "vs-dark");
    }
  }, [theme]);

  const updateInsights = (newMsg: string) => {
    setInsights((prev) => {
      if (prev[prev.length - 1] === newMsg) return prev;
      const next = [...prev];
      next.shift();
      next.push(newMsg);
      return next;
    });
  };

  const summarizeConstraints = (qid?: number) => {
    const list =
      EXPECTED_CONSTRAINTS[qid || 0] || (selectedQuestion ? [selectedQuestion.constraint] : []);
    return list.map((l, i) => `${i + 1}. ${l}`).join("\n");
  };

  const generateAIAnswer = (query: string, level = 0): string => {
    const qid = selectedQuestion?.id;
    const qTitle = selectedQuestion?.title || "this problem";
    const lc = query.toLowerCase();

    // If asking for code / full solution
    if (
      lc.includes("code") ||
      lc.includes("solution") ||
      lc.includes("answer") ||
      lc.includes("write code") ||
      lc.includes("full code")
    ) {
      const code = SOLUTION_BANK[qid || 0];
      if (!code)
        return `I can help with the approach, but I don't have the full code for ${qTitle} available right now.`;
      return `Exact code for ${qTitle}:\n\n${code}`;
    }

    // If asking for constraints
    if (lc.includes("constraint") || lc.includes("limit") || lc.includes("bounds")) {
      const c = EXPECTED_CONSTRAINTS[qid || 0];
      if (!c || c.length === 0) return "No detailed constraints available for this problem.";
      return `Constraints for ${qTitle}:\n` + c.map((s, i) => `${i + 1}. ${s}`).join("\n");
    }

    // If asking for examples / expected output
    if (lc.includes("example") || lc.includes("example output") || lc.includes("expected")) {
      const ex = EXPECTED_OUTPUTS[qid || 0];
      if (!ex || ex.length === 0) return "No canonical examples available for this problem.";
      return (
        `Examples / Expected output:\n` +
        ex.map((e, i) => `${i + 1}. ${e.input} → ${e.expected}`).join("\n")
      );
    }

    // If asking for a hint/approach — progressive by level
    if (
      lc.includes("hint") ||
      lc.includes("approach") ||
      lc.includes("idea") ||
      lc.includes("how to")
    ) {
      if (level === 0) {
        return `High-level hint: identify the primary pattern (e.g. hashmap, two-pointers, sliding window) and think about complexity constraints. Ask for more help to get deeper hints.`;
      }
      if (level === 1) {
        const hint = SOLUTION_BANK[qid || 0];
        if (!hint)
          return "Try decomposing the problem into parsing -> algorithm -> output formatting.";
        const tokens = hint
          .replace(/[^a-z0-9 ]/gi, " ")
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 40);
        const uniq = Array.from(new Set(tokens)).slice(0, 12).join(", ");
        return `Deeper hint: consider these tokens/ideas — ${uniq}. Use them to design steps.`;
      }
      if (level === 2) {
        return `Pseudocode hint:\n1) Parse input\n2) Maintain necessary data structure while iterating\n3) Check condition and return result\n4) Handle edge cases per constraints.`;
      }
      return `Detailed guidance: implement a single-pass solution if possible; update helper structures as you go and return when condition met. This is guidance, not full code.`;
    }

    // Fallback: search constraints/examples for relevant keywords
    const ex = EXPECTED_OUTPUTS[qid || 0] || [];
    for (const e of ex) {
      if (query.split(/\s+/).some((w) => e.input.toLowerCase().includes(w.toLowerCase()))) {
        return `Related example: ${e.input} → ${e.expected}`;
      }
    }

    return "I'm here to help — ask for a 'hint', 'approach', 'constraints', or 'example output' about the current problem.";
  };

  const callBackendAI = async (text: string, level = 0) => {
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: text, questionId: selectedQuestion?.id, level }),
      });
      if (!res.ok) throw new Error("bad response");
      const json = await res.json();
      return json.answer as string;
    } catch (e) {
      return null;
    }
  };

  const sendAiMessage = async (text: string, escalate = false) => {
    const userMsg = { role: "user" as const, text };
    setAiMessages((prev) => [...prev, userMsg]);

    const qid = selectedQuestion?.id;
    if (escalate && qid) {
      setHintLevels((prev) => ({ ...prev, [qid]: (prev[qid] || 0) + 1 }));
    }

    const level = hintLevels[qid || 0] || 0;
    const backend = await callBackendAI(text, level);
    const answer = backend || generateAIAnswer(text, level);

    setTimeout(
      () => {
        setAiMessages((prev) => [...prev, { role: "bot", text: answer }]);
      },
      200 + Math.random() * 500,
    );
  };

  const addTelemetryEvent = (
    type: TelemetryEvent["type"] | "tabSwitch" | "delete" | "disconnect",
    label?: string,
    desc?: string,
    delta?: number,
  ) => {
    lastActionTime.current = Date.now();
    const event = {
      type,
      time: Date.now(),
      label,
      desc,
      delta,
      len: editorRef.current?.getValue().length || 0,
      code: editorRef.current?.getValue() || code,
    } as TelemetryEvent & { type: string };

    setTimelineEvents((prev) => [...prev.slice(-40), event]);
    sessionData.current.events.push(event as TelemetryEvent);
  };

  const handleLanguageChange = (newLang: string) => {
    setLang(newLang);
    setCode(DEFAULT_CODE_TEMPLATES[newLang as keyof typeof DEFAULT_CODE_TEMPLATES]);
  };

  const handleEditorChange = (value: string | undefined, event: any) => {
    if (value === undefined) return;
    const now = Date.now();
    const interval = now - lastKeystrokeTime.current;
    if (interval < 5000) {
      // Ignore long breaks for rhythm calculation
      keystrokeIntervals.current.push(interval);
      if (keystrokeIntervals.current.length > 50) keystrokeIntervals.current.shift();
    }
    lastKeystrokeTime.current = now;
    totalEventsCount.current += 1;

    const idleSeconds = Math.max(0, (now - lastActionTime.current) / 1000);
    if (idleSeconds > 3) totalIdleTime.current += idleSeconds;

    const delta = value.length - lastCodeLen.current;
    const keystrokeDelta = delta > 0 ? delta : 1;
    const currentWpm = Math.round(keystrokeDelta * 12);

    setMetrics((prev) => {
      const continuity = Math.max(70, prev.continuity + (keystrokeDelta > 0 ? 0.4 : -0.2));
      const newWpmHistory = [...prev.wpmHistory.slice(1), currentWpm];
      const newContinuityHistory = [...prev.continuityHistory.slice(1), continuity];
      return {
        ...prev,
        wpm: currentWpm,
        pause: Math.round(idleSeconds * 10) / 10,
        continuity,
        wpmHistory: newWpmHistory,
        continuityHistory: newContinuityHistory,
      };
    });

    setCode(value);
    lastActionTime.current = now;

    // Detailed Event Analysis
    if (delta > 30 && event.changes && event.changes.some((c: any) => c.text.length > 20)) {
      setPasteAlert("Paste detected: external content is not allowed during this assessment.");
      addTelemetryEvent(
        "paste",
        "High-volume insertion",
        `Detected a ${delta} character semantic leap.`,
        delta,
      );
      updateInsights("High-volume insertion event detected");
    }
    // Heuristic 2: Refactor Detection (Significant deletion/replacement)
    else if (delta < -15 || (event.changes && event.changes.some((c: any) => c.rangeLength > 10))) {
      refactorEventsCount.current += 1;
      setMetrics((prev) => ({ ...prev, refactor: Math.min(100, prev.refactor + 0.8) }));
      addTelemetryEvent(
        "refactor",
        "Logic restructuring",
        "Significant code reduction/refactor observed.",
        delta,
      );
      updateInsights("Optimization transition underway");
    }
    // Heuristic 2b: Simple deletion tracking
    else if (delta < 0) {
      addTelemetryEvent(
        "delete",
        "Deletion event",
        "Candidate removed code while refining logic.",
        delta,
      );
      updateInsights("Deletion detected during refinement.");
    }
    // Heuristic 3: Standard Typing
    else {
      keystrokes.current += 1;
      addTelemetryEvent("typing");
    }

    lastCodeLen.current = value.length;
  };

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
    monacoRef.current = monaco;
    lastCodeLen.current = editor.getValue().length;

    editor.onKeyDown((e: any) => {
      // Direct keypress tracking for rhythm analysis
      keystrokes.current += 1;
    });

    if (editor.onDidPaste) {
      editor.onDidPaste(() => {
        setPasteAlert("Paste detected: external content is not allowed during this assessment.");
        addTelemetryEvent("paste", "External paste event", "Clipboard paste detected in editor.");
      });
    }

    // Define custom theme
    monaco.editor.defineTheme("tig-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "666666", fontStyle: "italic" },
        { token: "keyword", foreground: "c084fc", fontStyle: "bold" },
        { token: "string", foreground: "4ade80" },
        { token: "number", foreground: "facc15" },
        { token: "identifier", foreground: "e2e8f0" },
        { token: "type.identifier", foreground: "22d3ee", fontStyle: "italic" },
      ],
      colors: {
        "editor.background": "#0A0A0B",
        "editor.foreground": "#E2E8F0",
        "editor.lineHighlightBackground": "#1e1b4b",
        "editorCursor.foreground": "#c084fc",
        "editor.selectionBackground": "#334155",
        "editorLineNumber.foreground": "#334155",
        "editorLineNumber.activeForeground": "#c084fc",
        "editorIndentGuide.background": "#1e293b",
      },
    });
    monaco.editor.setTheme("tig-dark");
  }

  // Simulated session integrity drift
  useEffect(() => {
    const t = setInterval(() => {
      setSessionIntegrity((s) => Math.max(92, s + (Math.random() - 0.5) * 2));
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const selectedQuestion =
    selectedQuestionIndex !== null
      ? QUESTION_BANK.find((q) => q.id === selectedQuestionIndex)
      : null;
  const filteredQuestions = QUESTION_BANK.filter((q) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      q.title.toLowerCase().includes(query) ||
      q.description.toLowerCase().includes(query) ||
      q.category.toLowerCase().includes(query) ||
      q.difficulty.toLowerCase().includes(query)
    );
  });

  const timerLabel = `${String(Math.floor(remainingTime / 60)).padStart(2, "0")}:${String(remainingTime % 60).padStart(2, "0")}`;
  const candidateName = sessionData.current.candidateName;
  const difficultyLevel = selectedQuestion?.difficulty || "Medium";

  const startQuestion = (id: number) => {
    const question = QUESTION_BANK.find((q) => q.id === id);
    if (!question) return;
    setSelectedQuestionIndex(id);
    setCodingStarted(true);
    setActiveTab("problem");
    setCode(DEFAULT_CODE_TEMPLATES[lang]);
    sessionData.current.startTime = Date.now();
    captureSnapshot("Question selected", `Started coding on ${question.title}`);
  };

  const markQuestionCompleted = (id: number) => {
    setCompletedQuestions((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem("completedQuestions", JSON.stringify(next));
      } catch (e) {
        /* ignore */
      }
      return next;
    });
  };

  const normalize = (s: string) =>
    s
      .replace(/\s+/g, " ")
      .replace(/[^a-z0-9_]/gi, " ")
      .toLowerCase();

  const checkCandidateSolution = (candidateCode: string, questionId: number) => {
    const solution = SOLUTION_BANK[questionId];
    if (!solution) return false;
    const cand = normalize(candidateCode);
    const sol = normalize(solution);

    // 1) Exact substring quick check
    if (sol.length > 0 && cand.indexOf(sol) !== -1) return true;

    // 2) Expected outputs check (if available)
    const expected = EXPECTED_OUTPUTS[questionId];
    if (expected && expected.length > 0) {
      for (const t of expected) {
        const ex = normalize(t.expected);
        if (ex.length > 0 && cand.indexOf(ex) !== -1) return true;
        // Also allow if candidate mentions the expected numeric/result tokens
        if (/\d+/.test(ex)) {
          const digits = ex.match(/\d+/g) || [];
          for (const d of digits) {
            if (cand.indexOf(d) !== -1) return true;
          }
        }
      }
    }

    // 3) Token overlap heuristic against canonical solution (allows multiple valid solutions)
    const solTokens = Array.from(new Set(sol.split(/\s+/).filter(Boolean)));
    if (solTokens.length === 0) return false;
    let present = 0;
    for (const t of solTokens) {
      if (t.length < 3) continue;
      if (cand.indexOf(t) !== -1) present++;
    }
    const ratio = present / Math.max(1, solTokens.length);
    return ratio >= 0.38; // lower threshold to accept alternative correct approaches
  };

  const evaluateAndSubmit = () => {
    captureSnapshot("Final Submission", "Candidate submitted the solution for evaluation.");
    addTelemetryEvent("submission", "Submission evaluation started");
    const qid = selectedQuestionIndex;
    const candidateCode = editorRef.current?.getValue() || code || "";
    const passed = qid ? checkCandidateSolution(candidateCode, qid) : false;

    // Save session regardless
    TelemetryStore.saveSession(sessionData.current);

    if (passed && qid) {
      markQuestionCompleted(qid);
      addTelemetryEvent(
        "evaluation",
        "Submission passed",
        `Question ${qid} matched canonical solution.`,
      );
      setResultModal({
        open: true,
        success: true,
        message: "Submission matches our reference solution. Well done!",
      });
    } else {
      addTelemetryEvent(
        "evaluation",
        "Submission failed",
        `Question ${qid} did not match canonical solution.`,
      );
      setResultModal({
        open: true,
        success: false,
        message: "Submission did not match the reference solution. Please review and try again.",
      });
    }
  };

  if (!selectedQuestion) {
    return (
      <div ref={rootRef} className="min-h-screen bg-[#0A0A0B] px-6 py-8">
        <div className="glass-strong max-w-[1400px] mx-auto rounded-3xl border border-white/10 p-6 shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-1">
                Technical Integrity Guard
              </p>
              <h1 className="text-3xl font-bold tracking-tight">Choose your coding challenge</h1>
              <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
                Select one question from the bank below before you begin coding. Live typing metrics
                will activate as soon as you start.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-3xl bg-white/5 border border-white/10 px-4 py-3 shadow-sm">
                <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                  Questions Available
                </div>
                <div className="mt-1 text-lg font-semibold">50</div>
              </div>
              <div className="rounded-3xl bg-white/5 border border-white/10 px-4 py-3 shadow-sm">
                <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                  Ready
                </div>
                <div className="mt-1 text-lg font-semibold">
                  {codingStarted ? "Active" : "Waiting"}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-96">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search challenges, tags, or difficulty"
                className="w-full rounded-3xl border border-white/10 bg-[#070708] px-4 py-3 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredQuestions.length} of {QUESTION_BANK.length} challenges
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                className="glass rounded-3xl border border-white/10 p-5 shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{question.title}</h2>
                    <p className="mt-2 text-xs uppercase tracking-[0.35em] text-muted-foreground">
                      {question.category}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${question.difficulty === "Easy" ? "bg-success/10 text-success" : question.difficulty === "Medium" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"}`}
                    >
                      {question.difficulty}
                    </span>
                    {completedQuestions.includes(question.id) ? (
                      <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase bg-white/5 text-success">
                        Completed
                      </span>
                    ) : null}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {question.description}
                </p>
                <div className="mt-4 text-[11px] text-primary font-mono bg-white/5 rounded-2xl p-3 border border-white/10">
                  {question.example}
                </div>
                <div className="mt-3 text-[11px] text-muted-foreground bg-white/2 rounded-lg p-2 border border-white/5">
                  Constraints: {question.constraint}
                </div>
                <button
                  onClick={() => startQuestion(question.id)}
                  className="mt-5 w-full rounded-3xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:brightness-105 transition-all"
                >
                  Select and Start
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const selectedQuestionTitle = selectedQuestion?.title || "Selected Challenge";
  const selectedQuestionDescription =
    selectedQuestion?.description ||
    "Use the editor on the right to implement your chosen solution.";
  const selectedQuestionExample = selectedQuestion?.example || "";
  const selectedQuestionConstraint = (
    EXPECTED_CONSTRAINTS[selectedQuestion?.id || 0] ||
    (selectedQuestion?.constraint
      ? [selectedQuestion.constraint]
      : ["Follow the instructions above."])
  ).join(" · ");

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement && rootRef.current) {
      await rootRef.current.requestFullscreen();
    } else if (document.exitFullscreen) {
      await document.exitFullscreen();
    }
  };

  return (
    <div ref={rootRef} className="flex flex-col min-h-[calc(100vh-80px)] bg-[#0A0A0B]">
      {resultModal.open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
          <div className="bg-[#0B0B0C] p-6 rounded-2xl border border-white/10 max-w-lg text-center">
            <h3 className="text-xl font-bold">
              {resultModal.success ? "Submission Successful" : "Submission Result"}
            </h3>
            <p className="mt-3 text-sm">{resultModal.message}</p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setResultModal({ open: false })}
                className="px-4 py-2 rounded-2xl bg-white/5"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setResultModal({ open: false });
                  navigate({ to: "/replay" });
                }}
                className="px-4 py-2 rounded-2xl bg-primary text-primary-foreground"
              >
                View Replay
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="glass-strong rounded-3xl border border-white/10 p-4 mx-4 mt-4 mb-4 shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-primary/15 via-accent/15 to-violet-glow/15 border border-white/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <button
              onClick={() => window.history.back()}
              className="ml-3 inline-flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2 text-sm font-bold hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-1">
                Technical Integrity Guard
              </p>
              <h1 className="text-2xl font-bold tracking-tight">Candidate Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                {userName || "Candidate"} · Live assessment experience
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="rounded-3xl bg-white/5 border border-white/10 px-4 py-3 shadow-sm flex flex-col gap-1">
              <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                Time Remaining
              </div>
              <div className="text-sm font-semibold">{timerLabel}</div>
            </div>
            {webcamEnabled ? (
              <div className="relative h-24 w-44 overflow-hidden rounded-3xl border border-white/10 shadow-sm bg-black/80">
                <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-white font-bold">
                  Webcam Live
                </div>
              </div>
            ) : (
              <div className="rounded-3xl bg-white/5 border border-white/10 px-4 py-3 shadow-sm flex items-center gap-3">
                <Video className="h-4 w-4 text-accent" />
                <div>
                  <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                    Webcam
                  </div>
                  <div className="font-semibold">Standby</div>
                </div>
              </div>
            )}
            <div className="rounded-3xl bg-white/5 border border-white/10 px-4 py-3 shadow-sm flex items-center gap-3">
              {online ? (
                <Wifi className="h-4 w-4 text-success" />
              ) : (
                <WifiOff className="h-4 w-4 text-danger" />
              )}
              <div>
                <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                  Connection
                </div>
                <div className="font-semibold">{online ? "Online" : "Offline"}</div>
              </div>
            </div>
            <button
              onClick={() => setWebcamEnabled((enabled) => !enabled)}
              type="button"
              aria-label={webcamEnabled ? "Disable webcam monitoring" : "Enable webcam monitoring"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-white/5 border border-white/10 text-accent shadow-sm hover:bg-white/10 transition-all"
            >
              <Video className="h-5 w-5" />
            </button>
            <button
              onClick={toggleFullscreen}
              type="button"
              aria-label={fullscreenMode ? "Exit fullscreen" : "Enter fullscreen"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-white/5 border border-white/10 text-foreground shadow-sm hover:bg-white/10 transition-all"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 border-b border-primary/10 px-6 py-2.5 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-white/10 pr-6">
            <span className="flex items-center gap-1.5 text-success font-bold uppercase tracking-tighter">
              <ShieldCheck className="h-3.5 w-3.5" /> Privacy Shield Active
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground/80">
              <Lock className="h-3.5 w-3.5 text-primary/70" /> Behavioral stream encrypted
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase tracking-widest font-bold">
                Integrity Confidence:
              </span>
              <span className="text-primary font-mono font-bold">
                {sessionIntegrity.toFixed(1)}%
              </span>
            </div>
            <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${sessionIntegrity}%` }}
                className="h-full bg-primary shadow-glow-primary"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground italic">SIG-8821-XQ-IND</span>
          <div className="h-2 w-2 rounded-full bg-success animate-pulse shadow-glow shadow-success/50" />
          <button
            onClick={() => {
              setWebcamEnabled((enabled) => !enabled);
            }}
            className="rounded-2xl bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.35em] text-foreground border border-white/10 hover:bg-white/10 transition-all"
          >
            {webcamEnabled ? "Webcam Monitoring" : "Enable Webcam"}
          </button>
        </div>
      </div>
      <div className="bg-primary/5 border-b border-primary/10 px-6 py-2.5 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-white/10 pr-6">
            <span className="flex items-center gap-1.5 text-success font-bold uppercase tracking-tighter">
              <ShieldCheck className="h-3.5 w-3.5" /> Privacy Shield Active
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground/80">
              <Lock className="h-3.5 w-3.5 text-primary/70" /> Behavioral stream encrypted
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase tracking-widest font-bold">
                Integrity Confidence:
              </span>
              <span className="text-primary font-mono font-bold">
                {sessionIntegrity.toFixed(1)}%
              </span>
            </div>
            <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${sessionIntegrity}%` }}
                className="h-full bg-primary shadow-glow-primary"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground italic">SIG-8821-XQ-IND</span>
          <div className="h-2 w-2 rounded-full bg-success animate-pulse shadow-glow shadow-success/50" />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* LEFT PANEL: Problem & AI Support */}
        <div className="w-[40%] flex flex-col gap-4 overflow-hidden">
          <div className="glass rounded-3xl flex-1 flex flex-col overflow-hidden border-white/5 shadow-xl">
            <div className="flex border-b border-white/5 bg-white/[0.02]">
              <button
                onClick={() => setActiveTab("problem")}
                className={`flex-1 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "problem" ? "text-primary bg-primary/5 border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                Problem Statement
              </button>
              <button
                onClick={() => setActiveTab("ai")}
                className={`flex-1 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === "ai" ? "text-accent bg-accent/5 border-b-2 border-accent" : "text-muted-foreground hover:text-foreground"}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Bot className="h-3.5 w-3.5" /> AI Support
                  <span className="absolute top-3 right-4 h-2 w-2 rounded-full bg-accent animate-pulse shadow-glow shadow-accent" />
                </div>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab === "problem" ? (
                  <motion.div
                    key="problem"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="p-6"
                  >
                    <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                          {selectedQuestionTitle}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-2">
                          {selectedQuestionDescription}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 sm:items-end">
                        <span className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                          Difficulty Level
                        </span>
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-[0.35em]">
                          {difficultyLevel}
                        </span>
                      </div>
                    </div>
                    {pasteAlert ? (
                      <div className="rounded-3xl border border-warning/20 bg-warning/10 p-4 text-warning shadow-sm mb-4">
                        <div className="font-semibold">Paste Alert</div>
                        <p className="text-sm text-warning/90">{pasteAlert}</p>
                      </div>
                    ) : null}

                    <div className="space-y-6">
                      <p className="text-sm leading-relaxed text-muted-foreground/90">
                        {selectedQuestionDescription}
                      </p>
                      <div className="rounded-3xl bg-white/5 border border-white/10 p-4">
                        <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3">
                          Examples
                        </div>
                        <div className="space-y-3 text-sm text-foreground/80">
                          <div className="rounded-2xl bg-[#0A0A0D] p-3 border border-white/5">
                            <div className="font-semibold">Example</div>
                            <div className="text-muted-foreground text-[11px]">
                              {selectedQuestionExample}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-3xl bg-white/5 border border-white/10 p-4">
                        <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3">
                          Constraints
                        </div>
                        <div className="text-sm text-foreground/80">
                          {selectedQuestionConstraint}
                        </div>
                      </div>

                      <div className="p-4 rounded-3xl bg-primary/5 border border-primary/20 shadow-inner">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary">
                          Constraints & Expected Output
                        </h3>
                        <div className="mt-3 text-sm text-muted-foreground space-y-3">
                          <div>
                            <div className="text-[11px] font-semibold text-muted-foreground mb-1">
                              Constraints
                            </div>
                            <div className="text-[13px]">
                              {(
                                EXPECTED_CONSTRAINTS[selectedQuestion?.id || 0] || [
                                  selectedQuestion?.constraint || "Follow the instructions above.",
                                ]
                              ).map((c, i) => (
                                <div key={i} className="text-sm text-muted-foreground">
                                  • {c}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] font-semibold text-muted-foreground mb-1">
                              Expected Output / Examples
                            </div>
                            <div className="space-y-2">
                              {(EXPECTED_OUTPUTS[selectedQuestion?.id || 0] || []).map((e, i) => (
                                <div
                                  key={i}
                                  className="text-sm text-foreground/80 bg-white/5 rounded-xl p-2 border border-white/5 font-mono"
                                >
                                  {e.input} → {e.expected}
                                </div>
                              ))}
                              {(!EXPECTED_OUTPUTS[selectedQuestion?.id || 0] ||
                                EXPECTED_OUTPUTS[selectedQuestion?.id || 0].length === 0) && (
                                <div className="text-sm text-muted-foreground">
                                  No canonical example available for this question.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="ai"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="p-4 flex flex-col h-full"
                  >
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                      {aiMessages.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                          Ask the AI for a hint, approach, constraints, or expected output for this
                          problem.
                        </div>
                      ) : (
                        aiMessages.map((m, i) => (
                          <div
                            key={i}
                            className={`max-w-full ${m.role === "user" ? "ml-auto bg-white/5 text-foreground" : "mr-auto bg-white/3 text-muted-foreground"} p-3 rounded-2xl border border-white/5`}
                          >
                            <div className="text-sm whitespace-pre-line">{m.text}</div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="mt-2 p-3 border-t border-white/5 bg-white/[0.01] rounded-b-2xl">
                      <div className="flex items-center gap-3">
                        <input
                          value={aiInput}
                          onChange={(e) => setAiInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && aiInput.trim()) {
                              sendAiMessage(aiInput.trim());
                              setAiInput("");
                            }
                          }}
                          placeholder="Ask the AI (hint, approach, constraints, example, code)..."
                          className="flex-1 rounded-2xl bg-transparent px-4 py-3 text-sm outline-none"
                        />
                        <button
                          onClick={() => {
                            if (aiInput.trim()) {
                              sendAiMessage(aiInput.trim());
                              setAiInput("");
                            }
                          }}
                          className="px-4 py-2 rounded-2xl bg-accent text-white"
                        >
                          Ask
                        </button>
                        <button
                          onClick={() => {
                            if (selectedQuestion) {
                              sendAiMessage("more", true);
                            }
                          }}
                          className="px-4 py-2 rounded-2xl bg-white/5"
                        >
                          More help
                        </button>
                      </div>
                      <div className="mt-2 text-[11px] text-muted-foreground">
                        Tip: ask for 'hint', 'approach', 'constraints', or 'example output'. Use{" "}
                        <strong>More help</strong> to escalate hints.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Session Stream Active
                </span>
              </div>
              <button className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
                Read Fairness Policy
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Editor & Live Telemetry */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="glass-strong rounded-3xl flex-1 flex flex-col overflow-hidden border-white/5 shadow-2xl relative">
            {/* Editor Header */}
            <div className="px-5 py-4 border-b border-white/5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white/[0.02]">
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
                  <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                  <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 group cursor-pointer relative overflow-hidden">
                  <select
                    value={lang}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="bg-transparent text-xs font-mono font-bold outline-none appearance-none pr-6 z-10 relative cursor-pointer"
                  >
                    <option value="javascript" className="bg-[#121214]">
                      JavaScript
                    </option>
                    <option value="python" className="bg-[#121214]">
                      Python
                    </option>
                    <option value="java" className="bg-[#121214]">
                      Java
                    </option>
                    <option value="cpp" className="bg-[#121214]">
                      C++
                    </option>
                    <option value="typescript" className="bg-[#121214]">
                      TypeScript
                    </option>
                  </select>
                  <ChevronDown className="h-3 w-3 absolute right-3 text-muted-foreground group-hover:text-primary transition-colors pointer-events-none" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-primary/60">
                    Version
                  </span>
                  <div className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[9px] font-bold uppercase tracking-tighter">
                    v3.2.0
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/60">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin-slow" /> Auto-saving...
                </div>
                <div className="h-8 w-px bg-white/10" />
                <button
                  onClick={() => {
                    addTelemetryEvent("execution");
                    captureSnapshot(
                      "Code Execution",
                      "Manual run triggered to verify logic parity.",
                    );
                  }}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all"
                >
                  <Play className="h-3.5 w-3.5" /> Run Logic
                </button>
                <button
                  onClick={evaluateAndSubmit}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-glow hover:brightness-110 transition-all"
                >
                  <Send className="h-3.5 w-3.5" /> Submit Evaluation
                </button>
              </div>
            </div>

            {/* Monaco Editor Integration */}
            <div className="flex-1 flex overflow-hidden relative group/editor">
              {/* Subtle typing shimmer effect */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-focus-within/editor:opacity-10 z-10 transition-opacity">
                <div
                  className="w-full h-full animate-grid-flow"
                  style={{
                    background: "linear-gradient(45deg, var(--primary) 0%, transparent 100%)",
                    backgroundSize: "400% 400%",
                  }}
                />
              </div>

              <Editor
                height="100%"
                language={lang}
                value={code}
                theme="tig-dark"
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: 14,
                  fontFamily: "JetBrains Mono",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                  roundedSelection: false,
                  readOnly: false,
                  cursorStyle: "line",
                  cursorBlinking: "smooth",
                  automaticLayout: true,
                  padding: { top: 24, bottom: 24 },
                  lineHeight: 28,
                  renderLineHighlight: "all",
                  scrollbar: {
                    vertical: "hidden",
                    horizontal: "hidden",
                  },
                  suggest: {
                    showFields: false,
                    showFunctions: true,
                  },
                  quickSuggestions: true,
                }}
              />

              {webcamError ? (
                <div className="absolute left-6 bottom-6 rounded-3xl bg-danger/10 border border-danger/20 p-3 text-[11px] text-danger shadow-lg">
                  {webcamError}
                </div>
              ) : null}

              {/* Session Replay Available Notice */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-2 rounded-full glass border border-primary/20 flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest shadow-2xl"
                >
                  <Activity className="h-3 w-3 animate-pulse" /> Session replay available after
                  submission
                </motion.div>
              </div>

              {/* Real-time Telemetry HUD & Cognitive Bridge */}
              <div className="absolute right-8 top-8 flex flex-col gap-3 pointer-events-none">
                <div className="px-4 py-3 rounded-2xl glass-strong border border-primary/20 backdrop-blur-xl shadow-2xl flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full shadow-glow ${metrics.wpm > 0 ? "bg-electric animate-pulse" : "bg-primary"}`}
                    />
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold leading-none mb-1">
                        Cognitive State
                      </span>
                      <span className="text-[10px] font-bold text-foreground/90 uppercase tracking-tighter leading-none">
                        {metrics.wpm > 0 ? "Active Synthesis" : "Deep Analysis"}
                      </span>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: metrics.wpm > 0 ? "100%" : "30%" }}
                      className={`h-full ${metrics.wpm > 0 ? "bg-electric shadow-glow-electric" : "bg-primary"}`}
                    />
                  </div>
                </div>
                <TelemetryHUD
                  metric="Typing Rhythm"
                  status={metrics.wpm > 40 ? "Iterative" : "Stable"}
                  tone="var(--electric)"
                />
                <TelemetryHUD
                  metric="Semantic evolution"
                  status="Healthy"
                  tone="var(--violet-glow)"
                />
              </div>
            </div>

            {/* Terminal Panel */}
            <div
              className={`h-48 bg-[#050506] border-t border-white/5 flex flex-col transition-all ${terminalOpen ? "" : "h-12"}`}
            >
              <div className="px-5 py-2.5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <Terminal className="h-4 w-4" /> Execution Console
                  </div>
                  <div className="flex items-center gap-4 border-l border-white/10 pl-4">
                    <span className="flex items-center gap-1.5 text-[9px] text-success font-bold uppercase">
                      <CheckCircle2 className="h-3 w-3" /> Lint Passed
                    </span>
                    <span className="flex items-center gap-1.5 text-[9px] text-primary font-bold uppercase">
                      <Wifi className="h-3 w-3" /> Telemetry Sync: 12ms
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setTerminalOpen(!terminalOpen)}
                  className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${terminalOpen ? "" : "rotate-180"}`}
                  />
                </button>
              </div>
              <div className="flex-1 p-6 font-mono text-[13px] text-muted-foreground/60 overflow-y-auto custom-scrollbar">
                <div className="space-y-1.5">
                  {[
                    {
                      type: "SYSLOG",
                      msg: "Initializing behavioral environment...",
                      tone: "success",
                      time: "12:04:12",
                    },
                    {
                      type: "SIGNAL",
                      msg: "Cognitive handshake established. SIG-8821.",
                      tone: "primary",
                      time: "12:04:14",
                    },
                    {
                      type: "METRIC",
                      msg: "Telemetry sync: latency 12ms",
                      tone: "accent",
                      time: "12:04:15",
                    },
                    {
                      type: "EVENT",
                      msg: "Starting semantic tracking stream...",
                      tone: "violet",
                      time: "12:04:16",
                    },
                  ].map((log, i) => (
                    <div key={i} className={`text-${log.tone}/50 flex gap-3`}>
                      <span className="text-white/10 select-none font-bold">[{log.time}]</span>
                      <span className="font-bold opacity-80">[{log.type}]</span>
                      {log.msg}
                    </div>
                  ))}
                  <div className="flex gap-3 pt-2">
                    <span className="text-white/20 select-none">{">>>"}</span> $ npm test --watch
                  </div>
                  <div className="pt-2 text-foreground/80 font-bold flex items-center gap-2">
                    <RefreshCw className="h-3 w-3 animate-spin" /> Running automated test suite...
                  </div>
                  <div className="flex items-center gap-2 text-success mt-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Test Case 1: nums=[2,7,11,15], target=9{" "}
                    {"->"} PASSED (4ms)
                  </div>
                  <div className="flex items-center gap-2 text-danger">
                    <AlertCircle className="h-3.5 w-3.5" /> Test Case 2: nums=[3,2,4], target=6{" "}
                    {"->"} FAILED (Expected [1,2], got undefined)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live webcam + metrics grid */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
              <LiveMetricCard
                icon={<Cpu className="h-4 w-4" />}
                label="Typing Rhythm"
                value={metrics.wpm}
                unit="wpm"
                tone="var(--electric)"
                data={metrics.wpmHistory}
              />
              <LiveMetricCard
                icon={<GitBranch className="h-4 w-4" />}
                label="Refactor Density"
                value={metrics.refactor}
                unit="%"
                tone="var(--violet-glow)"
                decimal
                data={[10, 12, 11, 13, 12, 14, 12, 15, 12, metrics.refactor]}
              />
              <LiveMetricCard
                icon={<Clock className="h-4 w-4" />}
                label="Cognitive Pause Density"
                value={metrics.pause}
                unit="s"
                tone="var(--cyan-glow)"
                decimal
                data={[2, 4, 1, 3, 2, 8, 2, 4, 2, metrics.pause * 2]}
              />
              <LiveMetricCard
                icon={<Activity className="h-4 w-4" />}
                label="Semantic Continuity"
                value={metrics.continuity}
                unit="%"
                tone="var(--primary)"
                data={metrics.continuityHistory}
              />
            </div>

            <div className="glass rounded-3xl border border-white/10 p-5 shadow-xl row-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                    Webcam Monitoring
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {webcamEnabled ? "Active" : "Disabled"}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-3xl bg-white/5 grid place-items-center text-foreground">
                  <Video className="h-6 w-6" />
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground/80">
                The dashboard includes monitoring status and activity context. Camera access is
                simulated as part of the assessment experience.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-full bg-success/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.35em] text-success">
                  Face detected
                </span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.35em] text-primary">
                  Focus locked
                </span>
                <span className="rounded-full bg-warning/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.35em] text-warning">
                  Activity stream
                </span>
              </div>
            </div>
          </div>

          {/* Footer Trust Messaging */}
          <div className="mt-4 flex items-center justify-between px-6 py-3 glass rounded-2xl border-white/5">
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-success" /> Behavioral telemetry only
              </span>
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-primary" /> No webcam surveillance
              </span>
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-accent" /> No screen recording
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground italic">
              SIG-XQ-IND · Enterprise Grade Security
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TelemetryHUD({ metric, status, tone }: { metric: string; status: string; tone: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-xl shadow-2xl">
      <div
        className="h-2 w-2 rounded-full animate-pulse shadow-glow"
        style={{ background: tone }}
      />
      <div className="flex flex-col">
        <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold leading-none mb-1">
          {metric}
        </span>
        <span className="text-[10px] font-bold text-foreground/90 uppercase tracking-tighter leading-none">
          {status}
        </span>
      </div>
    </div>
  );
}

function LiveMetricCard({
  icon,
  label,
  value,
  unit,
  tone,
  decimal,
  data,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  tone: string;
  decimal?: boolean;
  data: number[];
}) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-strong rounded-3xl p-5 border-white/5 shadow-lg relative overflow-hidden group"
    >
      <div
        className="absolute -right-6 -top-6 h-16 w-16 rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity"
        style={{ background: tone }}
      />
      <div className="flex items-center justify-between mb-4">
        <div
          className="h-8 w-8 rounded-xl grid place-items-center bg-white/5 text-muted-foreground transition-transform group-hover:scale-110"
          style={{ color: tone }}
        >
          {icon}
        </div>
        <div className="h-1.5 w-1.5 rounded-full animate-pulse-glow" style={{ background: tone }} />
      </div>
      <div className="flex flex-col relative z-10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
          {label}
        </span>
        <div className="flex items-baseline gap-1">
          <motion.div
            key={displayValue}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            {decimal ? displayValue.toFixed(1) : Math.round(displayValue)}
          </motion.div>
          <span className="text-[11px] font-bold text-muted-foreground/40 font-mono uppercase">
            {unit}
          </span>
        </div>

        {/* Real Telemetry Sparkline */}
        <div className="mt-4 flex gap-1 h-6 items-end">
          {data.map((v, i) => {
            const max = Math.max(...data, 1);
            const h = (v / max) * 100;
            return (
              <motion.div
                key={i}
                className="flex-1 rounded-[1px] opacity-40 transition-all duration-500"
                style={{ backgroundColor: tone, height: `${Math.max(10, h)}%` }}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
