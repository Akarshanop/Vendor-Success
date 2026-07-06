import type { AgentVerdict } from "@/types";
import { StatusPill } from "./StatusPill";
import { Bot } from "lucide-react";
import { relativeTime } from "@/lib/format";

export function AgentVerdictItem({ verdict }: { verdict: AgentVerdict }) {
  return (
    <div className="flex gap-3 py-3 border-b last:border-0">
      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
        <Bot className="h-4 w-4 text-[#0D1F3C]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-[#0D1F3C]">{verdict.agentName}</span>
          <StatusPill status={verdict.verdict} />
          <span className="text-xs text-slate-500">{verdict.confidence}% conf.</span>
          <span className="text-xs text-slate-400 ml-auto">{relativeTime(verdict.ranAt)}</span>
        </div>
        <p className="text-sm text-slate-600 mt-1">{verdict.message}</p>
      </div>
    </div>
  );
}
