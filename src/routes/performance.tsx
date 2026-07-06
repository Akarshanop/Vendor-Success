import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { currentSupplier, healthScoreHistory, onTimeDelivery, complaints, reviews } from "@/data/seed";
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/performance")({
  head: () => ({ meta: [{ title: "Performance — Uganda GEP" }] }),
  component: PerformancePage,
});

function PerformancePage() {
  const breakdown = [
    { name: "Delivery", val: 82 }, { name: "Quality", val: 74 }, { name: "Responsiveness", val: 71 }, { name: "Compliance", val: 78 },
  ];
  return (
    <AppShell>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#0D1F3C]">My Performance</h1>
        <p className="text-sm text-slate-500">Scorecard, trends, and coaching to level up.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 rounded-xl lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-slate-500">Composite Health Score</div>
              <div className="text-4xl font-bold text-[#0D1F3C]">{currentSupplier.healthScore}<span className="text-lg text-slate-400">/100</span></div>
              <div className="text-sm text-emerald-600 mt-1">Good · Silver tier</div>
            </div>
            <Badge className="bg-slate-200 text-slate-700 text-sm px-3 py-1">🥈 Silver</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {breakdown.map((b) => (
              <div key={b.name}>
                <div className="text-xs text-slate-500">{b.name}</div>
                <div className="text-2xl font-bold">{b.val}</div>
                <div className="h-1 mt-1 bg-slate-100 rounded"><div className="h-full bg-[#0D1F3C] rounded" style={{ width: `${b.val}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5 rounded-xl bg-gradient-to-br from-[#F59E0B]/10 to-white border-[#F59E0B]/30">
          <div className="flex items-center gap-2 mb-3"><Sparkles className="h-4 w-4 text-[#F59E0B]" /><div className="font-semibold text-[#0D1F3C]">AI Coaching</div></div>
          <div className="text-sm text-slate-700 mb-3">To reach Gold tier (+8 pts needed):</div>
          <ol className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="font-bold">1.</span><div>Lift on-time delivery 82% → 90%. Northern-region orders are +18% slower. <a href="#" className="text-[#0D1F3C] underline">See orders</a></div></li>
            <li className="flex gap-2"><span className="font-bold">2.</span><div>Reduce cancellations — 3 this quarter.</div></li>
            <li className="flex gap-2"><span className="font-bold">3.</span><div>Complete NSSF filing (+2 compliance points). <a href="/compliance" className="text-[#0D1F3C] underline">Renew now</a></div></li>
          </ol>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 rounded-xl">
          <div className="text-sm font-medium mb-2">Health score (12mo)</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={healthScoreHistory}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={11} /><YAxis fontSize={11} domain={[50, 100]} /><Tooltip />
              <Line type="monotone" dataKey="score" stroke="#0D1F3C" strokeWidth={2} dot={{ fill: "#F59E0B" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4 rounded-xl">
          <div className="text-sm font-medium mb-2">On-time delivery %</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={onTimeDelivery}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={11} /><YAxis fontSize={11} domain={[0, 100]} /><Tooltip />
              <Bar dataKey="pct" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4 rounded-xl">
          <div className="text-sm font-medium mb-2">Complaints</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={complaints}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={11} /><YAxis fontSize={11} /><Tooltip />
              <Bar dataKey="n" fill="#EF4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-5 rounded-xl">
        <div className="font-semibold text-[#0D1F3C] mb-3">Customer reviews</div>
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm">{r.buyer}</div>
                <div className="flex items-center gap-2">
                  <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "text-[#F59E0B] fill-[#F59E0B]" : "text-slate-300"}`} />)}</div>
                  <Badge className={r.sentiment === "positive" ? "bg-emerald-100 text-emerald-700" : r.sentiment === "negative" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"}>{r.sentiment}</Badge>
                </div>
              </div>
              <div className="text-sm text-slate-600 mt-2">"{r.body}"</div>
              {r.sentiment === "negative" && <Button size="sm" variant="outline" className="mt-2">Reply</Button>}
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
