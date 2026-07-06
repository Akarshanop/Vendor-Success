import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { TenderCard } from "@/components/shared/TenderCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { tenders as seedTenders } from "@/data/seed";
import { Sparkles, Search, Check, X, ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Tender } from "@/types";
import { fmtUGX, fmtDate, daysBetween } from "@/lib/format";

export const Route = createFileRoute("/opportunities")({
  head: () => ({ meta: [{ title: "Opportunities — Uganda GEP" }] }),
  component: OpportunitiesPage,
});

function OpportunitiesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("match");
  const [selected, setSelected] = useState<Tender | null>(null);

  let tenders = seedTenders.filter((t) => (cat === "all" || t.category === cat) && (q === "" || t.title.toLowerCase().includes(q.toLowerCase()) || t.buyer.toLowerCase().includes(q.toLowerCase())));
  if (sort === "match") tenders = [...tenders].sort((a, b) => b.matchScore - a.matchScore);
  if (sort === "closing") tenders = [...tenders].sort((a, b) => daysBetween(a.submissionDeadline) - daysBetween(b.submissionDeadline));
  if (sort === "value") tenders = [...tenders].sort((a, b) => b.estimatedValueUGX - a.estimatedValueUGX);

  const strongMatches = seedTenders.filter((t) => t.matchScore >= 80).length;

  return (
    <AppShell>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#0D1F3C]">Tender opportunities</h1>
        <p className="text-sm text-slate-500">Discover tenders you're eligible for. Start bids from here.</p>
      </div>

      <Card className="p-4 rounded-xl mb-6 bg-gradient-to-r from-[#0D1F3C] to-[#1a3566] text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-[#F59E0B]" />
          <div>
            <div className="font-semibold">{strongMatches} tenders match you strongly (&gt;80%)</div>
            <div className="text-xs text-white/70">Highest: Ministry of Health — Medical Supplies Framework (89%)</div>
          </div>
        </div>
        <Button variant="outline" className="text-white border-white/30 bg-white/10 hover:bg-white/20">See all matched</Button>
      </Card>

      <Card className="p-3 rounded-xl mb-4 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="h-4 w-4 absolute left-2 top-2.5 text-slate-400" />
          <Input placeholder="Search tenders..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-8" />
        </div>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="Medical">Medical</SelectItem>
            <SelectItem value="Office">Office</SelectItem>
            <SelectItem value="ICT">ICT</SelectItem>
            <SelectItem value="Works">Works</SelectItem>
            <SelectItem value="Agriculture">Agriculture</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="match">Best match</SelectItem>
            <SelectItem value="closing">Closing soon</SelectItem>
            <SelectItem value="value">Highest value</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <div className="space-y-3">
        {tenders.map((t) => <TenderCard key={t.id} tender={t} onClick={() => setSelected(t)} onBid={() => setSelected(t)} />)}
      </div>

      <TenderDrawer tender={selected} onClose={() => setSelected(null)} />
    </AppShell>
  );
}

function TenderDrawer({ tender, onClose }: { tender: Tender | null; onClose: () => void }) {
  const [bidStep, setBidStep] = useState(1);
  const [bidAmount, setBidAmount] = useState("");
  if (!tender) return null;

  return (
    <Sheet open={!!tender} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[720px] p-0 overflow-y-auto">
        <SheetHeader className="p-5 border-b sticky top-0 bg-white z-10">
          <SheetTitle>{tender.title}</SheetTitle>
          <div className="text-xs text-slate-500">{tender.buyer} · {tender.district} · {fmtUGX(tender.estimatedValueUGX)} · closes {fmtDate(tender.submissionDeadline)}</div>
        </SheetHeader>
        <Tabs defaultValue="summary" className="p-5">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="elig">Eligibility</TabsTrigger>
            <TabsTrigger value="fit">My Fit</TabsTrigger>
            <TabsTrigger value="bid">Bid</TabsTrigger>
            <TabsTrigger value="similar">Similar</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="space-y-3">
            <p className="text-sm text-slate-700">{tender.description ?? "This tender solicits qualified suppliers for the delivery of stated goods and services. Bid documents include a detailed Bill of Quantities and terms of reference."}</p>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3"><div className="text-xs text-slate-500">Estimated value</div><div className="font-semibold">{fmtUGX(tender.estimatedValueUGX)}</div></Card>
              <Card className="p-3"><div className="text-xs text-slate-500">Bid bond</div><div className="font-semibold">{tender.bidBondRequired ? fmtUGX(tender.bidBondAmountUGX) : "Not required"}</div></Card>
              <Card className="p-3"><div className="text-xs text-slate-500">Bidders so far</div><div className="font-semibold">{tender.numBidders}</div></Card>
              <Card className="p-3"><div className="text-xs text-slate-500">Category</div><div className="font-semibold">{tender.category}</div></Card>
            </div>
            <Button variant="outline">Download BoQ</Button>
          </TabsContent>
          <TabsContent value="elig" className="space-y-2">
            {tender.eligibilityChecks.map((c, i) => (
              <div key={i} className="p-3 border rounded flex items-start gap-3">
                {c.met ? <Check className="h-5 w-5 text-emerald-500 mt-0.5" /> : <X className="h-5 w-5 text-rose-500 mt-0.5" />}
                <div className="flex-1">
                  <div className="font-medium text-sm">{c.requirement}</div>
                  {c.reason && <div className="text-xs text-slate-500 mt-0.5">{c.reason}</div>}
                </div>
                {!c.met && <Button size="sm" variant="link">Fix →</Button>}
              </div>
            ))}
          </TabsContent>
          <TabsContent value="fit" className="space-y-3">
            <Card className="p-4">
              <div className="text-xs text-slate-500">Overall match score</div>
              <div className="text-3xl font-bold text-[#0D1F3C]">{tender.matchScore}%</div>
            </Card>
            <div className="space-y-2 text-sm">
              {[["Category match", 40, 92], ["Region match", 25, 78], ["Preference match", 20, 100], ["Historical win pattern", 15, 74]].map(([n, w, s]) => (
                <div key={n as string}>
                  <div className="flex justify-between text-xs"><span>{n} (weight {w}%)</span><span className="font-medium">{s}%</span></div>
                  <div className="h-1.5 bg-slate-100 rounded"><div className="h-full bg-[#0D1F3C] rounded" style={{ width: `${s}%` }} /></div>
                </div>
              ))}
            </div>
            <Card className="p-3 bg-slate-50">
              <div className="text-sm font-medium mb-1">Win probability: {tender.winProbability}%</div>
              <div className="text-xs text-slate-600">Your typical technical score 74 vs required 70. Only {tender.numBidders} bidders so far.</div>
            </Card>
          </TabsContent>
          <TabsContent value="bid" className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">Step {bidStep} of 5</div>
            <div className="h-1.5 bg-slate-100 rounded overflow-hidden"><div className="h-full bg-[#0D1F3C]" style={{ width: `${(bidStep / 5) * 100}%` }} /></div>
            {bidStep === 1 && (
              <div>
                <label className="text-sm font-medium">Bid amount (UGX)</label>
                <Input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} placeholder={String(tender.estimatedValueUGX * 0.85)} />
                <div className="text-xs text-slate-500 mt-1">AI hint: median winning bid for similar tenders is {fmtUGX(tender.estimatedValueUGX * 0.85)}</div>
              </div>
            )}
            {bidStep === 2 && <div className="border-2 border-dashed rounded-lg p-6 text-center text-sm text-slate-500">Drop technical proposal (PDF) here (mock)</div>}
            {bidStep === 3 && (
              <div className="space-y-2 text-sm">
                <div>Preference declaration:</div>
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> SME</label>
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Women-led</label>
              </div>
            )}
            {bidStep === 4 && (
              <Card className="p-3 bg-amber-50"><div className="font-medium text-sm">Bid bond confirmation</div><div className="text-sm mt-1">Amount: {fmtUGX(tender.bidBondAmountUGX)}</div><div className="text-xs text-slate-500 mt-1">Upload receipt or Bank guarantee (mock)</div></Card>
            )}
            {bidStep === 5 && (
              <Card className="p-3">
                <div className="font-medium">Review</div>
                <div className="text-sm mt-2">Bid amount: {bidAmount ? fmtUGX(Number(bidAmount)) : "—"}</div>
                <div className="text-sm">Technical proposal: attached ✓</div>
                <div className="text-sm">Preferences: SME, Women-led</div>
                <div className="text-sm">Bid bond: confirmed</div>
              </Card>
            )}
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setBidStep(Math.max(1, bidStep - 1))} disabled={bidStep === 1}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
              {bidStep < 5 ? (
                <Button className="bg-[#0D1F3C]" onClick={() => setBidStep(bidStep + 1)}>Continue <ArrowRight className="h-4 w-4 ml-1" /></Button>
              ) : (
                <Button className="bg-emerald-600" onClick={() => { toast.success("Bid submitted!", { description: "Track in My Bids." }); onClose(); setBidStep(1); }}>Submit bid</Button>
              )}
            </div>
          </TabsContent>
          <TabsContent value="similar" className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-3">
                <div className="font-medium text-sm">Similar Framework — 2025 Q{i}</div>
                <div className="text-xs text-slate-500">Won by: Kampala MedCare Ltd · Winning bid: {fmtUGX(tender.estimatedValueUGX * 0.82)}</div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
