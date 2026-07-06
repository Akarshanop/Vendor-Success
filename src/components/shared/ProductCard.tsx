import type { Product } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "./StatusPill";
import { Camera, AlertTriangle, Eye, Pencil } from "lucide-react";
import { fmtUGX } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ProductCard({ product, onClick }: { product: Product; onClick?: () => void }) {
  const qColor = product.qualityScore >= 80 ? "text-emerald-600 bg-emerald-50" : product.qualityScore >= 60 ? "text-amber-600 bg-amber-50" : "text-rose-600 bg-rose-50";
  const stockColor = product.stock === 0 ? "text-rose-600" : product.stock > 100 ? "text-emerald-600" : "text-amber-600";
  return (
    <Card className="rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col cursor-pointer group" onClick={onClick}>
      <div className="relative aspect-video bg-slate-100 flex items-center justify-center">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center text-slate-400">
            <Camera className="h-8 w-8" /><span className="text-xs mt-1">Add image</span>
          </div>
        )}
        <div className={cn("absolute top-2 right-2 rounded-full h-9 w-9 flex items-center justify-center text-xs font-bold border-2 border-white shadow", qColor)}>
          {product.qualityScore}
        </div>
        {product.missingFields.length > 0 && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> {product.missingFields.length}
          </div>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col gap-2">
        <div>
          <div className="text-xs text-slate-500">{product.sku} · {product.brand}</div>
          <div className="font-medium text-sm text-[#0D1F3C] line-clamp-2">{product.name}</div>
        </div>
        <div className="text-xs text-slate-500">{product.categoryL1} › {product.categoryL2}</div>
        <div className="flex items-center justify-between mt-auto">
          <div className="font-semibold">{fmtUGX(product.unitPriceUGX)}</div>
          <span className={cn("text-xs font-medium", stockColor)}>Stock: {product.stock}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <StatusPill status={product.status} />
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
            <Button size="icon" variant="ghost" className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
