import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { StatusPill } from "@/components/shared/StatusPill";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { orders as seedOrders } from "@/data/seed";
import { fmtUGX, fmtDate, daysBetween } from "@/lib/format";
import { useState } from "react";
import type { Order } from "@/types";
import { MapPin, Upload, FileText, Truck } from "lucide-react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Orders — Uganda GEP" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState<Order | null>(null);
  const filtered = seedOrders.filter((o) => {
    if (tab === "all") return true;
    if (tab === "Overdue") return o.deliveryStatus !== "Delivered" && daysBetween(o.expectedDelivery) < 0;
    return o.deliveryStatus === tab;
  });

  return (
    <AppShell>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#0D1F3C]">Orders</h1>
        <p className="text-sm text-slate-500">Fulfil POs. Upload GRN. Move to payment.</p>
      </div>
      <Card className="rounded-xl overflow-hidden">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="border-b px-4"><TabsList className="bg-transparent">
            {["all", "Pending", "In Transit", "Delivered", "Overdue"].map((t) => <TabsTrigger key={t} value={t}>{t === "all" ? "All" : t}</TabsTrigger>)}
          </TabsList></div>
          <TabsContent value={tab} className="m-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO</TableHead><TableHead>Buyer</TableHead><TableHead>Category</TableHead>
                  <TableHead>Value</TableHead><TableHead>Order date</TableHead><TableHead>Expected</TableHead>
                  <TableHead>Delivery</TableHead><TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => {
                  const overdue = o.deliveryStatus !== "Delivered" && daysBetween(o.expectedDelivery) < 0;
                  return (
                    <TableRow key={o.id} onClick={() => setSelected(o)} className={`cursor-pointer ${overdue ? "bg-rose-50" : ""}`}>
                      <TableCell className="font-mono text-xs">{o.id}</TableCell>
                      <TableCell className="font-medium">{o.buyer}</TableCell>
                      <TableCell>{o.category}</TableCell>
                      <TableCell>{fmtUGX(o.totalUGX)}</TableCell>
                      <TableCell className="text-sm">{fmtDate(o.orderDate)}</TableCell>
                      <TableCell className="text-sm">{fmtDate(o.expectedDelivery)}</TableCell>
                      <TableCell><StatusPill status={o.deliveryStatus} /></TableCell>
                      <TableCell><StatusPill status={o.paymentStatus} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </Card>

      <OrderDrawer order={selected} onClose={() => setSelected(null)} />
    </AppShell>
  );
}

function OrderDrawer({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const { getRootProps, getInputProps } = useDropzone({ onDrop: () => setTimeout(() => toast.success("GRN uploaded"), 800) });
  if (!order) return null;
  return (
    <Sheet open={!!order} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[680px] p-0 overflow-y-auto">
        <SheetHeader className="p-5 border-b sticky top-0 bg-white z-10">
          <SheetTitle>{order.id}</SheetTitle>
          <div className="text-xs text-slate-500">{order.buyer} · {fmtUGX(order.totalUGX)}</div>
        </SheetHeader>
        <Tabs defaultValue="details" className="p-5">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="fulfil">Fulfilment</TabsTrigger>
            <TabsTrigger value="comm">Communication</TabsTrigger>
            <TabsTrigger value="invoice" disabled={order.deliveryStatus !== "Delivered"}>Invoice</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-3">
            <Card className="p-3 flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-slate-500" /> {order.district} · {order.buyer}</Card>
            <Card className="p-3">
              <div className="font-medium text-sm mb-2">Line items</div>
              <Table>
                <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Qty</TableHead><TableHead>Unit</TableHead><TableHead>Line</TableHead></TableRow></TableHeader>
                <TableBody>
                  {order.lineItems.map((li, i) => (
                    <TableRow key={i}><TableCell>{li.productName}</TableCell><TableCell>{li.qty}</TableCell><TableCell>{fmtUGX(li.unitPriceUGX)}</TableCell><TableCell>{fmtUGX(li.lineTotal)}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          <TabsContent value="fulfil" className="space-y-3">
            <div className="space-y-2">
              {["Prepare goods", "Print delivery note", "Confirm dispatch", "Upload proof of delivery", "Buyer signs GRN"].map((s, i) => (
                <label key={s} className="flex items-center gap-2 p-2 rounded border"><Checkbox defaultChecked={i < 2} /><span className="text-sm">{s}</span></label>
              ))}
            </div>
            <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer text-sm">
              <input {...getInputProps()} /><Upload className="h-5 w-5 mx-auto text-slate-400 mb-1" /> Drop GRN document
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => { toast.success("Order marked as delivered"); onClose(); }}><Truck className="h-4 w-4 mr-1" /> Mark as delivered</Button>
          </TabsContent>
          <TabsContent value="comm" className="text-sm text-slate-500 text-center py-8">See <a href="/messages" className="underline">Messages</a> for buyer conversation.</TabsContent>
          <TabsContent value="invoice" className="space-y-3">
            <Card className="p-3"><FileText className="h-8 w-8 text-slate-400 mx-auto" /><div className="text-center text-sm mt-2">Generate invoice for this delivered order</div></Card>
            <Button className="w-full bg-[#0D1F3C]" onClick={() => { toast.success("Invoice generated and sent to buyer"); onClose(); }}>Generate invoice</Button>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
