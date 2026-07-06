import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { StatusPill } from "@/components/shared/StatusPill";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { bids } from "@/data/seed";
import { fmtUGX, fmtDate } from "@/lib/format";
import { useState } from "react";
import type { Bid } from "@/types";
import { Trophy, XCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/bids")({
  head: () => ({ meta: [{ title: "My Bids — Uganda GEP" }] }),
  component: BidsPage,
});

function BidsPage() {
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState<Bid | null>(null);
  const filtered = tab === "all" ? bids : bids.filter((b) => b.status === tab);

  return (
    <AppShell>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#0D1F3C]">My Bids</h1>
        <p className="text-sm text-slate-500">Track your submissions. See why you won or lost.</p>
      </div>
      <Card className="rounded-xl overflow-hidden">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="border-b px-4"><TabsList className="bg-transparent">
            {["all", "Draft", "Submitted", "Under Evaluation", "Shortlisted", "Won", "Lost"].map((t) => <TabsTrigger key={t} value={t}>{t === "all" ? "All" : t}</TabsTrigger>)}
          </TabsList></div>
          <TabsContent value={tab} className="m-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bid ID</TableHead><TableHead>Tender</TableHead><TableHead>Buyer</TableHead>
                  <TableHead>Bid amount</TableHead><TableHead>Submitted</TableHead><TableHead>Status</TableHead>
                  <TableHead>Tech</TableHead><TableHead>Fin</TableHead><TableHead>Rank</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((b) => (
                  <TableRow key={b.id} onClick={() => setSelected(b)} className="cursor-pointer">
                    <TableCell className="font-mono text-xs">{b.id}</TableCell>
                    <TableCell className="font-medium">{b.tenderTitle}</TableCell>
                    <TableCell className="text-sm text-slate-600">{b.buyer}</TableCell>
                    <TableCell>{fmtUGX(b.bidAmountUGX)}</TableCell>
                    <TableCell className="text-sm">{fmtDate(b.submittedAt)}</TableCell>
                    <TableCell><StatusPill status={b.status} /></TableCell>
                    <TableCell>{b.technicalScore ?? "—"}</TableCell>
                    <TableCell>{b.financialScore ?? "—"}</TableCell>
                    <TableCell>{b.rank ? `#${b.rank}` : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </Card>

      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto">
          {selected && (
            <>
              <SheetHeader><SheetTitle>{selected.tenderTitle}</SheetTitle></SheetHeader>
              <div className="space-y-4 mt-4">
                {selected.status === "Won" && <Card className="p-4 bg-emerald-50 border-emerald-200"><div className="flex items-center gap-2 font-bold text-emerald-800"><Trophy className="h-5 w-5" /> Congratulations! You won this bid.</div><div className="text-sm text-emerald-700 mt-1">Prepare for contract signing.</div></Card>}
                {selected.status === "Lost" && (
                  <Card className="p-4 bg-rose-50 border-rose-200">
                    <div className="flex items-center gap-2 font-bold text-rose-800"><XCircle className="h-5 w-5" /> Not selected</div>
                    <div className="text-sm text-rose-700 mt-1">{selected.rejectionReason}</div>
                    <div className="mt-3 p-3 bg-white rounded flex gap-2"><Sparkles className="h-4 w-4 text-[#F59E0B]" /><div className="text-sm">AI coaching: Consider tighter pricing on similar tenders in future.</div></div>
                  </Card>
                )}
                <Card className="p-3"><div className="text-xs text-slate-500">Bid amount</div><div className="text-xl font-bold">{fmtUGX(selected.bidAmountUGX)}</div></Card>
                {selected.technicalScore && (
                  <Card className="p-3 grid grid-cols-3 gap-3">
                    <div><div className="text-xs text-slate-500">Technical</div><div className="font-bold">{selected.technicalScore}</div></div>
                    <div><div className="text-xs text-slate-500">Financial</div><div className="font-bold">{selected.financialScore}</div></div>
                    <div><div className="text-xs text-slate-500">Rank</div><div className="font-bold">#{selected.rank}</div></div>
                  </Card>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
