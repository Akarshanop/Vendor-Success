import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ProductCard } from "@/components/shared/ProductCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { products as seedProducts } from "@/data/seed";
import { Plus, Upload, Sparkles, Check, X, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { fmtUGX } from "@/lib/format";
import { StatusPill } from "@/components/shared/StatusPill";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export const Route = createFileRoute("/catalogue")({
  head: () => ({ meta: [{ title: "Catalogue — Uganda GEP" }] }),
  component: CataloguePage,
});

function CataloguePage() {
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState<string>("all");
  const [selected, setSelected] = useState<Product | null>(null);

  const products = seedProducts.filter((p) => (statusF === "all" || p.status === statusF) && (q === "" || p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase())));
  const total = seedProducts.length;
  const pub = seedProducts.filter((p) => p.status === "Published").length;
  const rev = seedProducts.filter((p) => p.status === "Under Review").length;
  const draft = seedProducts.filter((p) => p.status === "Draft").length;
  const avgQ = Math.round(seedProducts.reduce((s, p) => s + p.qualityScore, 0) / seedProducts.length);

  return (
    <AppShell>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1F3C]">My Catalogue</h1>
          <p className="text-sm text-slate-500">Add products, improve quality, publish to become bid-eligible.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info("CSV bulk upload (mock)")}><Upload className="h-4 w-4 mr-1" /> Bulk upload</Button>
          <Button className="bg-[#0D1F3C] hover:bg-[#0D1F3C]/90" onClick={() => setSelected(seedProducts[0])}><Plus className="h-4 w-4 mr-1" /> Add product</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <Card className="p-3 rounded-lg"><div className="text-xs text-slate-500">Total</div><div className="text-xl font-bold">{total}</div></Card>
        <Card className="p-3 rounded-lg"><div className="text-xs text-slate-500">Published</div><div className="text-xl font-bold text-emerald-600">{pub}</div></Card>
        <Card className="p-3 rounded-lg"><div className="text-xs text-slate-500">Under Review</div><div className="text-xl font-bold text-amber-600">{rev}</div></Card>
        <Card className="p-3 rounded-lg"><div className="text-xs text-slate-500">Draft</div><div className="text-xl font-bold text-slate-500">{draft}</div></Card>
        <Card className="p-3 rounded-lg"><div className="text-xs text-slate-500">Avg quality</div><div className="text-xl font-bold text-[#0D1F3C]">{avgQ}/100</div></Card>
      </div>

      <Card className="p-3 rounded-xl mb-4 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="h-4 w-4 absolute left-2 top-2.5 text-slate-400" />
          <Input placeholder="Search name or SKU..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-8" />
        </div>
        <Select value={statusF} onValueChange={setStatusF}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Published">Published</SelectItem>
            <SelectItem value="Under Review">Under Review</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((p) => <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} />)}
      </div>

      <ProductEditor product={selected} onClose={() => setSelected(null)} />
    </AppShell>
  );
}

function ProductEditor({ product, onClose }: { product: Product | null; onClose: () => void }) {
  if (!product) return null;
  const priceData = [{ n: "You", v: product.unitPriceUGX / 1000 }, { n: "Category median", v: (product.unitPriceUGX * 1.1) / 1000 }, { n: "Top-3 avg", v: (product.unitPriceUGX * 0.95) / 1000 }];
  const criteria = [
    { name: "Product image", ok: !!product.imageUrl },
    { name: "Description ≥150 chars", ok: product.qualityScore > 70 },
    { name: "Warranty specified", ok: !product.missingFields.includes("warranty") },
    { name: "Complete specs", ok: !product.missingFields.includes("specs") },
    { name: "Brand set", ok: !!product.brand },
    { name: "MOQ set", ok: product.moq > 0 },
    { name: "Lead time set", ok: product.leadTimeDays > 0 },
    { name: "Stock in place", ok: product.stock > 0 },
  ];
  return (
    <Sheet open={!!product} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[720px] p-0 overflow-y-auto">
        <SheetHeader className="p-5 border-b sticky top-0 bg-white z-10">
          <SheetTitle>{product.name}</SheetTitle>
          <div className="flex items-center gap-2 text-sm text-slate-500">{product.sku} · <StatusPill status={product.status} /></div>
        </SheetHeader>
        <Tabs defaultValue="info" className="p-5">
          <TabsList>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="ai">AI Enhancer</TabsTrigger>
            <TabsTrigger value="q">Quality</TabsTrigger>
            <TabsTrigger value="perf">Performance</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="space-y-3">
            <div><label className="text-xs text-slate-500">Name</label><Input defaultValue={product.name} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-slate-500">SKU</label><Input defaultValue={product.sku} /></div>
              <div><label className="text-xs text-slate-500">Brand</label><Input defaultValue={product.brand} /></div>
              <div><label className="text-xs text-slate-500">Unit price (UGX)</label><Input type="number" defaultValue={product.unitPriceUGX} /></div>
              <div><label className="text-xs text-slate-500">MOQ</label><Input type="number" defaultValue={product.moq} /></div>
              <div><label className="text-xs text-slate-500">Lead time (days)</label><Input type="number" defaultValue={product.leadTimeDays} /></div>
              <div><label className="text-xs text-slate-500">Stock</label><Input type="number" defaultValue={product.stock} /></div>
            </div>
            <div className="flex gap-2 pt-3">
              <Button variant="outline" onClick={() => { toast.success("Saved as draft"); onClose(); }}>Save draft</Button>
              <Button className="bg-[#0D1F3C]" onClick={() => { toast.success("Product submitted for publishing"); onClose(); }}>Save & publish</Button>
            </div>
          </TabsContent>
          <TabsContent value="ai" className="space-y-3">
            <Card className="p-3 rounded-lg border-l-4 border-l-[#F59E0B]">
              <div className="flex items-center gap-1 font-medium text-sm"><Sparkles className="h-4 w-4 text-[#F59E0B]" /> Category Recommendation</div>
              <div className="text-sm mt-1">Suggested: <span className="font-medium">{product.categoryL1} › {product.categoryL2}</span></div>
              <div className="flex gap-2 mt-2"><Button size="sm" variant="outline">Accept</Button><Button size="sm" variant="ghost">Reject</Button></div>
            </Card>
            {product.missingFields.length > 0 && (
              <Card className="p-3 rounded-lg">
                <div className="font-medium text-sm">Missing fields</div>
                {product.missingFields.map((f) => (
                  <div key={f} className="flex items-center justify-between py-1.5 text-sm border-b last:border-0">
                    <span>{f}</span>
                    <Button size="sm" variant="link">Fill from AI</Button>
                  </div>
                ))}
              </Card>
            )}
            <Card className="p-3 rounded-lg">
              <div className="font-medium text-sm mb-2">Price benchmarking (UGX '000)</div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="n" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="v" fill="#0D1F3C" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>
          <TabsContent value="q" className="space-y-2">
            <div className="text-sm text-slate-500 mb-2">Quality Score: <span className="font-bold text-[#0D1F3C]">{product.qualityScore}/100</span></div>
            {criteria.map((c) => (
              <div key={c.name} className="flex items-center gap-2 p-2 border rounded">
                {c.ok ? <Check className="h-4 w-4 text-emerald-500" /> : <X className="h-4 w-4 text-rose-500" />}
                <span className="text-sm flex-1">{c.name}</span>
                {!c.ok && <Button size="sm" variant="link">Fix</Button>}
              </div>
            ))}
          </TabsContent>
          <TabsContent value="perf" className="space-y-3">
            {product.status === "Published" ? (
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-3"><div className="text-xs text-slate-500">Views</div><div className="text-xl font-bold">1,248</div></Card>
                <Card className="p-3"><div className="text-xs text-slate-500">Orders</div><div className="text-xl font-bold">{product.reviewCount}</div></Card>
                <Card className="p-3"><div className="text-xs text-slate-500">Revenue</div><div className="text-xl font-bold">{fmtUGX(product.unitPriceUGX * product.reviewCount * 40)}</div></Card>
              </div>
            ) : <div className="text-sm text-slate-500 text-center py-8">Publish the product to see performance data.</div>}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
