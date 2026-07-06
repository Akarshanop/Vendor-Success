import type { Tender } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "./StatusPill";
import { fmtUGX, daysBetween } from "@/lib/format";
import { Building2, MapPin, Users, Clock, Check, X, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export function TenderCard({ tender, onClick, onBid }: { tender: Tender; onClick?: () => void; onBid?: () => void }) {
  const daysLeft = daysBetween(tender.submissionDeadline);
  const matchColor = tender.matchScore >= 80 ? "bg-emerald-500" : tender.matchScore >= 60 ? "bg-sky-500" : tender.matchScore >= 40 ? "bg-amber-500" : "bg-slate-400";
  return (
    <Card className="p-5 rounded-xl hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className={cn("h-14 w-14 rounded-xl flex flex-col items-center justify-center text-white", matchColor)}>
            <div className="text-lg font-bold leading-none">{tender.matchScore}%</div>
            <div className="text-[9px] uppercase tracking-wide">match</div>
          </div>
          <div className={cn("text-[10px] font-medium flex items-center gap-1", daysLeft <= 3 ? "text-rose-600" : daysLeft <= 7 ? "text-amber-600" : "text-slate-500")}>
            <Clock className="h-3 w-3" /> {daysLeft}d left
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 justify-between">
            <div className="min-w-0">
              <div className="font-semibold text-[#0D1F3C] text-base leading-tight">{tender.title}</div>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{tender.buyer}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{tender.district}</span>
                <span>{tender.category}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{tender.numBidders} bidders</span>
              </div>
            </div>
            <StatusPill status={tender.status} />
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {tender.eligibilityChecks.slice(0, 4).map((c, i) => (
              <span key={i} className={cn("inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border",
                c.met ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200")}>
                {c.met ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />} {c.requirement}
              </span>
            ))}
          </div>

          <div className="flex items-end justify-between mt-3 gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>Win probability</span><span className="font-semibold text-slate-700">{tender.winProbability}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-xs">
                <div className={cn("h-full", tender.winProbability >= 60 ? "bg-emerald-500" : tender.winProbability >= 30 ? "bg-amber-500" : "bg-rose-400")} style={{ width: `${tender.winProbability}%` }} />
              </div>
              <div className="mt-2 text-sm"><span className="text-slate-500">Est. value: </span><span className="font-semibold">{fmtUGX(tender.estimatedValueUGX)}</span></div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); }}><Bookmark className="h-3.5 w-3.5" /></Button>
              <Button size="sm" className="bg-[#0D1F3C] hover:bg-[#0D1F3C]/90" onClick={(e) => { e.stopPropagation(); onBid?.(); }}>Bid now</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
