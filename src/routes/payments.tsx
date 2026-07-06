import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { StatusPill } from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { payments as seedPayments } from "@/data/seed";
import { fmtUGX, fmtDate } from "@/lib/format";
import { useState } from "react";
import type { Payment } from "@/types";
import { FileText, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/payments")({
  head: () => ({ meta: [{ title: "Payments — Uganda GEP" }] }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState<Payment | null>(null);
  const filtered = tab === "all" ? seedPayments : seedPayments.filter((p) => p.status === tab);

  const receivables = seedPayments.filter((p) => p.status !== "Paid").reduce((s, p) => s + p.netUGX, 0);
  const paidThisMonth = seedPayments.filter((p) => p.status === "Paid").reduce((s, p) => s + p.netUGX, 0);
  const avgDays = Math.round(seedPayments.filter((p) => p.daysToPayment).reduce((s, p) => s + (p.daysToPayment ?? 0), 0) / seedPayments.filter((p) => p.daysToPayment).length);

  return (
    <AppShell>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#0D1F3C]">Payments</h1>
        <p className="text-sm text-slate-500">Invoice delivered orders. Track receivables.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Card className="p-3 rounded-lg"><div className="text-xs text-slate-500">Total receivables</div><div className="text-xl font-bold">{fmtUGX(receivables)}</div></Card>
        <Card className="p-3 rounded-lg"><div className="text-xs text-slate-500">Paid this month</div><div className="text-xl font-bold text-emerald-600">{fmtUGX(paidThisMonth)}</div></Card>
        <Card className="p-3 rounded-lg"><div className="text-xs text-slate-500">Avg days to payment</div><div className="text-xl font-bold">{avgDays}d</div></Card>
        <Card className="p-3 rounded-lg"><div className="text-xs text-slate-500">Overdue (&gt;30d)</div><div className="text-xl font-bold text-rose-600">0</div></Card>
      </div>

      <Card className="rounded-xl overflow-hidden">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="border-b px-4"><TabsList className="bg-transparent">
            {["all", "Not Invoiced", "Invoiced", "Under Review", "Paid"].map((t) => <TabsTrigger key={t} value={t}>{t === "all" ? "All" : t}</TabsTrigger>)}
          </TabsList></div>
          <TabsContent value={tab} className="m-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Invoice #</TableHead><TableHead>Order</TableHead><TableHead>Buyer</TableHead>
                <TableHead>Gross</TableHead><TableHead>VAT</TableHead><TableHead>WHT</TableHead><TableHead>Net</TableHead>
                <TableHead>Status</TableHead><TableHead>Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id} onClick={() => setSelected(p)} className="cursor-pointer">
                    <TableCell className="font-mono text-xs">{p.invoiceNumber || "—"}</TableCell>
                    <TableCell className="text-xs">{p.orderId}</TableCell>
                    <TableCell>{p.buyer}</TableCell>
                    <TableCell>{fmtUGX(p.grossUGX)}</TableCell>
                    <TableCell className="text-sm">{fmtUGX(p.vatUGX)}</TableCell>
                    <TableCell className="text-sm">-{fmtUGX(p.whtUGX)}</TableCell>
                    <TableCell className="font-medium">{fmtUGX(p.netUGX)}</TableCell>
                    <TableCell><StatusPill status={p.status} /></TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {p.status === "Not Invoiced" && <Button size="sm" onClick={() => toast.success("Invoice generated")}>Generate</Button>}
                      {p.status === "Invoiced" && <Button size="sm" variant="outline"><Send className="h-3 w-3 mr-1" /> Remind</Button>}
                      {p.status === "Paid" && <Button size="sm" variant="ghost">Receipt</Button>}
                    </TableCell>
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
              <SheetHeader><SheetTitle>Payment breakdown</SheetTitle></SheetHeader>
              <div className="space-y-3 mt-4">
                <Card className="p-4 bg-slate-50"><FileText className="h-12 w-12 text-slate-400 mx-auto" /><div className="text-center text-sm mt-2 text-slate-500">Invoice PDF preview (mock)</div></Card>
                <Card className="p-4 space-y-2">
                  <div className="flex justify-between text-sm"><span>Gross</span><span className="font-medium">{fmtUGX(selected.grossUGX)}</span></div>
                  <div className="flex justify-between text-sm"><span>+ VAT (18%)</span><span className="font-medium text-emerald-600">+{fmtUGX(selected.vatUGX)}</span></div>
                  <div className="flex justify-between text-sm"><span>− WHT (6%)</span><span className="font-medium text-rose-600">-{fmtUGX(selected.whtUGX)}</span></div>
                  <div className="flex justify-between font-bold pt-2 border-t"><span>Net payable</span><span>{fmtUGX(selected.netUGX)}</span></div>
                </Card>
                <Card className="p-3"><div className="text-xs text-slate-500">Buyer payment history</div><div className="text-sm mt-1">{selected.buyer}: avg 14d to pay · 100% payment rate</div></Card>
                {selected.paidDate && <div className="text-sm text-emerald-600">Paid on {fmtDate(selected.paidDate)} · {selected.daysToPayment}d turnaround</div>}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
