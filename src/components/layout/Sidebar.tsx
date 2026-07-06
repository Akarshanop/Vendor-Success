import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Rocket, Package, Target, FileText, ShoppingCart, CreditCard, BarChart3, ShieldCheck, MessageSquare, Search, Bell, Sparkles } from "lucide-react";
import { currentSupplier, journey } from "@/data/seed";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/onboarding", icon: Rocket, label: "Onboarding" },
  { to: "/catalogue", icon: Package, label: "Catalogue" },
  { to: "/opportunities", icon: Target, label: "Opportunities" },
  { to: "/bids", icon: FileText, label: "My Bids" },
  { to: "/orders", icon: ShoppingCart, label: "Orders" },
  { to: "/payments", icon: CreditCard, label: "Payments" },
  { to: "/performance", icon: BarChart3, label: "Performance" },
  { to: "/compliance", icon: ShieldCheck, label: "Compliance" },
  { to: "/messages", icon: MessageSquare, label: "Messages" },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const j = useAppStore((s) => s.journey);
  const complete = j.filter((x) => x.status === "Approved" || x.status === "Complete").length;
  const total = 7;

  return (
    <aside className="w-64 bg-[#0D1F3C] text-white flex flex-col shrink-0 min-h-screen">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-[#F59E0B] text-[#0D1F3C] font-bold">NT</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate">{currentSupplier.name}</div>
            <div className="text-xs text-white/60 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-[#10B981]" /> Verified
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-white/60 mb-1.5">
            <span>Onboarding</span><span>{complete}/{total} stages</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#F59E0B]" style={{ width: `${(complete/total)*100}%` }} />
          </div>
        </div>
      </div>

      <nav className="flex-1 py-3">
        {navItems.map((item) => {
          const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors border-l-2 ${active ? "bg-white/5 border-[#F59E0B] text-white font-medium" : "border-transparent text-white/70 hover:bg-white/5 hover:text-white"}`}>
              <Icon className="h-4 w-4" /> {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="rounded-lg bg-white/5 p-3">
          <div className="text-xs text-white/60">Health Score</div>
          <div className="flex items-baseline gap-2 mt-1">
            <div className="text-2xl font-bold">{currentSupplier.healthScore}</div>
            <div className="text-xs text-[#10B981]">Good</div>
          </div>
          <div className="text-xs text-white/60 mt-1">{currentSupplier.id}</div>
        </div>
      </div>
    </aside>
  );
}

export function TopHeader() {
  const setAiOpen = useAppStore((s) => s.setAiOpen);
  const setCmdOpen = useAppStore((s) => s.setCmdOpen);
  return (
    <header className="h-16 flex items-center gap-4 px-6 border-b bg-white/70 backdrop-blur-xl sticky top-0 z-30">
      <div className="font-bold text-[#0D1F3C]">Uganda GEP</div>
      <button onClick={() => setCmdOpen(true)}
        className="flex-1 max-w-md flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 text-sm">
        <Search className="h-4 w-4" /> Search my data...
        <kbd className="ml-auto text-xs bg-white border rounded px-1.5 py-0.5">⌘K</kbd>
      </button>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 bg-[#EF4444] text-[10px]">3</Badge>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setAiOpen(true)} className="text-[#F59E0B]">
          <Sparkles className="h-5 w-5" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-[#0D1F3C] text-white text-xs">NT</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
