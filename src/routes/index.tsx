import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { KpiCard } from "@/components/shared/KpiCard";
import { StageStepper } from "@/components/shared/StageStepper";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertBanner } from "@/components/shared/AlertBanner";
import { certifications, tenders, orders, payments, activityFeed, healthScoreHistory, currentSupplier } from "@/data/seed";
import { fmtUGX, relativeTime, daysBetween } from "@/lib/format";
import { useAppStore } from "@/store/app-store";
import { toast } from "sonner";
import { ArrowRight, Zap, FileWarning, Clock, Truck, Wallet, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Home — Uganda GEP Supplier Portal" }] }),
  component: Home,
});

function Home() {
  const j = useAppStore((s) => s.journey);
  const simulate = useAppStore((s) => s.simulateOpsApproval);
  const complete = j.filter((x) => x.status === "Approved" || x.status === "Complete").length;
  const currentStage = j.find((x) => x.status === "In Progress" || x.status === "Under Review");

  const expiringCerts = certifications.filter((c) => c.daysToExpiry <= 60 && c.daysToExpiry >= 0);
  const closingTenders = tenders.filter((t) => daysBetween(t.submissionDeadline) <= 7 && t.matchScore >= 50).length;
  const pendingOrders = orders.filter((o) => o.deliveryStatus === "Pending" || o.deliveryStatus === "In Transit").length;
  const receivables = payments.filter((p) => p.status !== "Paid").reduce((s, p) => s + p.netUGX, 0);
  const paidThisMonth = payments.filter((p) => p.status === "Paid").reduce((s, p) => s + p.netUGX, 0);
  const winRate = 28;

  const handleSim = () => {
    const r = simulate();
    if (r) toast.success(`Ops approved Stage: ${r.stage}`, { description: "Your onboarding advanced by one step." });
    else toast.info("No stage currently pending Ops review.");
  };

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1F3C]">Welcome back, Nakawa Traders</h1>
          <p className="text-sm text-slate-500">Here's what needs your attention today.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleSim} className="gap-2"><Zap className="h-3.5 w-3.5" /> Simulate Ops action</Button>
      </div>

      {/* Onboarding banner */}
      {complete < 7 && (
        <Card className="p-6 rounded-xl mb-6 text-white overflow-hidden relative" style={{ background: "linear-gradient(135deg, #0D1F3C 0%, #1a3566 100%)" }}>
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div>
              <div className="text-xl font-bold">You're {complete}/7 stages into onboarding. Next: complete your {currentStage?.stage ?? "catalogue"}.</div>
              <div className="text-white/70 text-sm mt-1">Estimated 2 days to go live if you finish catalogue today.</div>
              <Button asChild className="mt-4 bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-[#0D1F3C]">
                <Link to="/onboarding">Continue onboarding <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </div>
            <div className="hidden lg:block"><StageStepper compact /></div>
          </div>
        </Card>
      )}

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {expiringCerts.length > 0 && (
          <Card className="p-4 rounded-xl border-l-4 border-l-amber-500">
            <div className="flex items-start gap-3">
              <FileWarning className="h-5 w-5 text-amber-500 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-sm">{expiringCerts.length} documents expiring soon</div>
                <div className="text-xs text-slate-500 mt-1">Nearest: {expiringCerts[0].name} in {expiringCerts[0].daysToExpiry}d</div>
                <Button asChild size="sm" variant="link" className="px-0 h-auto mt-2 text-amber-700"><Link to="/compliance">Renew now →</Link></Button>
              </div>
            </div>
          </Card>
        )}
        {closingTenders > 0 && (
          <Card className="p-4 rounded-xl border-l-4 border-l-sky-500">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-sky-500 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-sm">{closingTenders} tenders closing this week</div>
                <div className="text-xs text-slate-500 mt-1">High match tenders — bid before deadline</div>
                <Button asChild size="sm" variant="link" className="px-0 h-auto mt-2 text-sky-700"><Link to="/opportunities">See tenders →</Link></Button>
              </div>
            </div>
          </Card>
        )}
        {pendingOrders > 0 && (
          <Card className="p-4 rounded-xl border-l-4 border-l-emerald-500">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-emerald-500 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-sm">{pendingOrders} orders pending delivery</div>
                <div className="text-xs text-slate-500 mt-1">Prepare goods, upload GRN when done</div>
                <Button asChild size="sm" variant="link" className="px-0 h-auto mt-2 text-emerald-700"><Link to="/orders">View orders →</Link></Button>
              </div>
            </div>
          </Card>
        )}
        <Card className="p-4 rounded-xl border-l-4 border-l-[#0D1F3C]">
          <div className="flex items-start gap-3">
            <Wallet className="h-5 w-5 text-[#0D1F3C] mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-sm">{fmtUGX(receivables)} in receivables</div>
              <div className="text-xs text-slate-500 mt-1">Invoice pending orders, chase overdue</div>
              <Button asChild size="sm" variant="link" className="px-0 h-auto mt-2 text-[#0D1F3C]"><Link to="/payments">See invoicing →</Link></Button>
            </div>
          </div>
        </Card>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <KpiCard title="Health Score" value={`${currentSupplier.healthScore}/100`} subtitle="Good" sparkline={healthScoreHistory.map((h) => h.score)} cta={{ label: "See performance", to: "/performance" }} color="#10B981" />
        <KpiCard title="Matching Tenders" value={tenders.filter((t) => t.matchScore >= 60).length} subtitle="3 closing this week" sparkline={[5, 6, 8, 7, 9, 10, 8]} cta={{ label: "Browse", to: "/opportunities" }} />
        <KpiCard title="Active Orders" value={pendingOrders} subtitle="2 pending delivery" sparkline={[2, 3, 2, 4, 3, 2, pendingOrders]} cta={{ label: "Fulfil", to: "/orders" }} color="#F59E0B" />
        <KpiCard title="30-day Revenue" value={fmtUGX(paidThisMonth)} delta="+12% vs last month" deltaDirection="up" sparkline={[15, 18, 22, 20, 24, 26, 25]} cta={{ label: "Payments", to: "/payments" }} color="#10B981" />
        <KpiCard title="Win Rate (12mo)" value={`${winRate}%`} delta="+4pt vs prior yr" deltaDirection="up" sparkline={[20, 22, 24, 23, 26, 27, 28]} cta={{ label: "My bids", to: "/bids" }} />
      </div>

      {/* AI recs + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-[#F59E0B]" /><h2 className="font-semibold text-[#0D1F3C]">Top AI recommendations</h2>
          </div>
          <div className="space-y-3">
            <Card className="p-4 rounded-xl border-l-4 border-l-[#F59E0B]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-sm">Bid on Ministry of Health — Medical PPE tender</div>
                  <div className="text-sm text-slate-600 mt-1">Match 89%, closing in 4 days, only 2 bidders so far.</div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">89% match</Badge>
              </div>
              <Button asChild size="sm" className="mt-3 bg-[#0D1F3C] hover:bg-[#0D1F3C]/90"><Link to="/opportunities">Open tender</Link></Button>
            </Card>
            <Card className="p-4 rounded-xl border-l-4 border-l-sky-500">
              <div className="font-semibold text-sm">Add 5 products in Office Supplies</div>
              <div className="text-sm text-slate-600 mt-1">High demand this quarter — your catalogue has a gap here.</div>
              <Button asChild size="sm" variant="outline" className="mt-3"><Link to="/catalogue">Add products</Link></Button>
            </Card>
            <Card className="p-4 rounded-xl border-l-4 border-l-rose-500">
              <div className="font-semibold text-sm">Renew NDA certification</div>
              <div className="text-sm text-slate-600 mt-1">Expires in 42 days. Delays could cost you 3 upcoming pharma tenders.</div>
              <Button asChild size="sm" variant="outline" className="mt-3"><Link to="/compliance">Start renewal</Link></Button>
            </Card>
          </div>
        </div>
        <div className="lg:col-span-2">
          <h2 className="font-semibold text-[#0D1F3C] mb-3">Recent activity</h2>
          <Card className="p-4 rounded-xl">
            <div className="space-y-3">
              {activityFeed.map((a) => (
                <div key={a.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="h-2 w-2 rounded-full bg-[#F59E0B] mt-1.5" />
                  <div className="flex-1">
                    <div className="text-sm">{a.text}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{relativeTime(a.at)}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
