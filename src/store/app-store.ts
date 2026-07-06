import { create } from "zustand";
import type { JourneyStage } from "@/types";
import { journey as initialJourney } from "@/data/seed";

interface AppState {
  journey: JourneyStage[];
  aiOpen: boolean;
  cmdOpen: boolean;
  setAiOpen: (v: boolean) => void;
  setCmdOpen: (v: boolean) => void;
  simulateOpsApproval: () => { stage: string } | null;
  advanceStage: (stage: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  journey: initialJourney,
  aiOpen: false,
  cmdOpen: false,
  setAiOpen: (v) => set({ aiOpen: v }),
  setCmdOpen: (v) => set({ cmdOpen: v }),
  simulateOpsApproval: () => {
    const j = [...get().journey];
    const idx = j.findIndex((s) => s.status === "In Progress" || s.status === "Under Review");
    if (idx === -1) return null;
    j[idx] = { ...j[idx], status: "Approved", completedAt: new Date().toISOString() };
    if (j[idx + 1] && j[idx + 1].status === "Not Started") {
      j[idx + 1] = { ...j[idx + 1], status: "In Progress", startedAt: new Date().toISOString() };
    }
    set({ journey: j });
    return { stage: j[idx].stage };
  },
  advanceStage: (stage) => {
    const j = get().journey.map((s) => s.stage === stage ? { ...s, status: "Under Review" as const } : s);
    set({ journey: j });
  },
}));
