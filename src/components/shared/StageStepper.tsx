import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { STAGES } from "@/types";
import { useAppStore } from "@/store/app-store";

export function StageStepper({ compact = false, onClick }: { compact?: boolean; onClick?: (stage: string) => void }) {
  const j = useAppStore((s) => s.journey);
  const stages = STAGES.slice(0, 7);
  return (
    <div className={cn("flex items-center", compact ? "gap-1" : "gap-2")}>
      {stages.map((stage, i) => {
        const st = j.find((x) => x.stage === stage);
        const status = st?.status ?? "Not Started";
        const done = status === "Approved" || status === "Complete";
        const active = status === "In Progress";
        const review = status === "Under Review";
        const rejected = status === "Rejected";
        return (
          <div key={stage} className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => onClick?.(stage)}
              className={cn(
                "flex items-center gap-2 rounded-full border transition-all",
                compact ? "h-7 px-2" : "h-9 px-3",
                done && "bg-emerald-500 border-emerald-500 text-white",
                active && "bg-white border-sky-400 text-sky-700 ring-2 ring-sky-200 animate-pulse",
                review && "bg-amber-50 border-amber-300 text-amber-700",
                rejected && "bg-rose-500 border-rose-500 text-white",
                !done && !active && !review && !rejected && "bg-white/40 border-white/40 text-white/70"
              )}
            >
              <span className={cn(
                "flex items-center justify-center rounded-full text-[10px] font-bold",
                compact ? "h-4 w-4" : "h-5 w-5",
                done && "bg-white/20",
                active && "bg-sky-100",
                review && "bg-amber-100",
                rejected && "bg-white/20",
                !done && !active && !review && !rejected && "bg-white/20"
              )}>
                {done ? <Check className="h-3 w-3" /> : rejected ? <X className="h-3 w-3" /> : review ? <Loader2 className="h-3 w-3 animate-spin" /> : i + 1}
              </span>
              {!compact && <span className="text-xs font-medium whitespace-nowrap">{stage}</span>}
            </button>
            {i < stages.length - 1 && <div className={cn("h-px", compact ? "w-3" : "w-4", done ? "bg-emerald-400" : "bg-white/30")} />}
          </div>
        );
      })}
    </div>
  );
}
