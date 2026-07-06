import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { useAppStore } from "@/store/app-store";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { products, tenders, orders, bids } from "@/data/seed";
import { Package, Target, ShoppingCart, FileText } from "lucide-react";

export function CommandPalette() {
  const { cmdOpen, setCmdOpen } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen(!cmdOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [cmdOpen, setCmdOpen]);

  const go = (path: string) => { setCmdOpen(false); navigate({ to: path }); };

  return (
    <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
      <CommandInput placeholder="Search products, tenders, orders, bids..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Products">
          {products.slice(0, 5).map((p) => (
            <CommandItem key={p.id} onSelect={() => go("/catalogue")}><Package className="h-4 w-4 mr-2" />{p.name} <span className="ml-auto text-xs text-slate-400">{p.sku}</span></CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Tenders">
          {tenders.slice(0, 5).map((t) => (
            <CommandItem key={t.id} onSelect={() => go("/opportunities")}><Target className="h-4 w-4 mr-2" />{t.title} <span className="ml-auto text-xs text-slate-400">{t.matchScore}%</span></CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Orders">
          {orders.slice(0, 4).map((o) => (
            <CommandItem key={o.id} onSelect={() => go("/orders")}><ShoppingCart className="h-4 w-4 mr-2" />{o.id} — {o.buyer}</CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Bids">
          {bids.slice(0, 4).map((b) => (
            <CommandItem key={b.id} onSelect={() => go("/bids")}><FileText className="h-4 w-4 mr-2" />{b.id} — {b.tenderTitle}</CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
