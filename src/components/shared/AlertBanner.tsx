import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  variant?: "info" | "warning" | "danger" | "success";
  title: string;
  body?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function AlertBanner({ variant = "info", title, body, actions, className }: Props) {
  const styles = {
    info: "bg-sky-50 border-sky-200 text-sky-900",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
    danger: "bg-rose-50 border-rose-200 text-rose-900",
    success: "bg-emerald-50 border-emerald-200 text-emerald-900",
  }[variant];
  const Icon = { info: Info, warning: AlertTriangle, danger: XCircle, success: CheckCircle2 }[variant];
  return (
    <div className={cn("rounded-xl border p-4 flex items-start gap-3", styles, className)}>
      <Icon className="h-5 w-5 mt-0.5 shrink-0" />
      <div className="flex-1">
        <div className="font-semibold">{title}</div>
        {body && <div className="text-sm mt-1 opacity-90">{body}</div>}
      </div>
      {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: React.ComponentType<{ className?: string }>; title: string; description?: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
        <Icon className="h-7 w-7 text-slate-400" />
      </div>
      <div className="mt-3 font-semibold text-[#0D1F3C]">{title}</div>
      {description && <div className="text-sm text-slate-500 mt-1 max-w-sm">{description}</div>}
      {action && <Button onClick={action.onClick} className="mt-4 bg-[#0D1F3C] hover:bg-[#0D1F3C]/90">{action.label}</Button>}
    </div>
  );
}
