import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/app-store";
import { Sparkles, Send, User } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { StatusPill } from "./StatusPill";
import { fmtUGX } from "@/lib/format";
import { tenders, certifications } from "@/data/seed";

const suggestions = [
  "What's blocking my onboarding right now?",
  "Which tender should I bid on this week?",
  "How can I improve my catalogue quality?",
  "When is my next cert expiring?",
  "Predict my chances on Tender UG-TND-2026-0142",
  "How much VAT did I collect this month?",
  "Draft a delivery note for Order UG-ORD-000891",
  "What's my payment likelihood from Ministry of Health?",
];

interface Msg { from: "me" | "ai"; text: string; component?: React.ReactNode }

function getReply(q: string): Msg {
  const l = q.toLowerCase();
  if (l.includes("blocking") || l.includes("onboarding")) {
    return { from: "ai", text: "You're in the Catalogue stage (6 of 7). You need to publish 10 products minimum — currently 3/10 are published. Focus on filling images for 4 products and completing warranty specs to move forward." };
  }
  if (l.includes("bid on this week") || l.includes("which tender")) {
    const best = tenders[0];
    return { from: "ai", text: "The strongest match closing this week:", component: (
      <Card className="p-3 mt-2">
        <div className="text-xs text-slate-500">{best.buyer}</div>
        <div className="font-semibold text-sm">{best.title}</div>
        <div className="flex items-center gap-2 mt-2 text-xs">
          <span className="text-emerald-600 font-bold">{best.matchScore}% match</span>
          <StatusPill status={best.status} />
        </div>
        <div className="text-xs mt-1">{fmtUGX(best.estimatedValueUGX)} · {best.numBidders} bidders</div>
      </Card>
    ) };
  }
  if (l.includes("catalogue quality")) {
    return { from: "ai", text: "Top 3 fixes to boost your average quality score from 72 to 85+:\n1. Add product images to 4 draft products\n2. Fill warranty months for medical devices (adds 8 pts each)\n3. Write descriptions ≥150 characters for all published SKUs" };
  }
  if (l.includes("cert") && l.includes("expir")) {
    const soon = certifications.find((c) => c.status === "Expiring Soon")!;
    return { from: "ai", text: `${soon.name} expires in ${soon.daysToExpiry} days (${soon.number}). Renew now to keep bidding on tenders requiring this cert.` };
  }
  if (l.includes("0142") || l.includes("predict")) {
    return { from: "ai", text: "For UG-TND-2026-0142 (Medical Supplies Framework): estimated win probability 72%. Only 2 bidders so far, your category match is strong (89%), and you qualify for Women-led preference. Fix: complete PPDA registration first." };
  }
  if (l.includes("vat")) {
    return { from: "ai", text: "VAT collected this month across paid invoices: UGX 5.04M (from Ministry of Health PAY-000885). YTD VAT: UGX 26.9M." };
  }
  if (l.includes("delivery note")) {
    return { from: "ai", text: "Draft delivery note for UG-ORD-000891 (Jinja Regional Hospital):\n\nDELIVERY NOTE\n────────────\nPO: UG-ORD-000891\nBuyer: Jinja Regional Hospital\nItems: 100 boxes Surgical Masks, 80 boxes Nitrile Gloves, 75 Digital Thermometers\nTotal: UGX 12.4M\n\n[Use draft]" };
  }
  if (l.includes("payment likelihood") || l.includes("ministry of health")) {
    return { from: "ai", text: "Ministry of Health payment pattern: avg 10 days after invoice approval, 100% payment rate across your last 4 orders. Very high likelihood." };
  }
  return { from: "ai", text: "I can help with onboarding progress, tender recommendations, catalogue quality, compliance renewals, and drafting documents. Try one of the suggestions below." };
}

export function AIAssistantDrawer() {
  const { aiOpen, setAiOpen } = useAppStore();
  const [messages, setMessages] = useState<Msg[]>([{ from: "ai", text: "Hi Nakawa Traders 👋 I'm your GEP assistant. What would you like to know?" }]);
  const [input, setInput] = useState("");

  const send = (q: string) => {
    if (!q.trim()) return;
    setMessages((m) => [...m, { from: "me", text: q }]);
    setInput("");
    setTimeout(() => setMessages((m) => [...m, getReply(q)]), 400);
  };

  return (
    <Sheet open={aiOpen} onOpenChange={setAiOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#F59E0B]" /> AI Assistant</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.from === "me" ? "justify-end" : ""}`}>
              {m.from === "ai" && <div className="h-8 w-8 rounded-full bg-[#0D1F3C] flex items-center justify-center shrink-0"><Sparkles className="h-4 w-4 text-[#F59E0B]" /></div>}
              <div className={`max-w-[85%] rounded-2xl p-3 text-sm whitespace-pre-line ${m.from === "me" ? "bg-[#0D1F3C] text-white" : "bg-slate-100"}`}>
                {m.text}
                {m.component}
              </div>
              {m.from === "me" && <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0"><User className="h-4 w-4" /></div>}
            </div>
          ))}
        </div>
        <div className="p-3 border-t">
          <div className="flex flex-wrap gap-1.5 mb-3 max-h-32 overflow-y-auto">
            {suggestions.map((s) => (
              <button key={s} onClick={() => send(s)} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700">{s}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Ask anything..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(input)} />
            <Button onClick={() => send(input)} size="icon" className="bg-[#0D1F3C]"><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
