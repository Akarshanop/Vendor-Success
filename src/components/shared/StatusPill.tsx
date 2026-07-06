import { cn } from "@/lib/utils";

const statusMap: Record<string, string> = {
  // Generic pass/positive
  "Approved": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Complete": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Verified": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Published": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Won": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Delivered": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Paid": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Valid": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Pass": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Shortlisted": "bg-emerald-50 text-emerald-700 border-emerald-200",
  // In progress / info
  "In Progress": "bg-sky-50 text-sky-700 border-sky-200",
  "Under Review": "bg-amber-50 text-amber-700 border-amber-200",
  "Under Evaluation": "bg-amber-50 text-amber-700 border-amber-200",
  "Manual Review": "bg-amber-50 text-amber-700 border-amber-200",
  "Submitted": "bg-sky-50 text-sky-700 border-sky-200",
  "Invoiced": "bg-sky-50 text-sky-700 border-sky-200",
  "In Transit": "bg-sky-50 text-sky-700 border-sky-200",
  "Processing": "bg-sky-50 text-sky-700 border-sky-200",
  "Open": "bg-sky-50 text-sky-700 border-sky-200",
  "Closing Soon": "bg-amber-50 text-amber-700 border-amber-200",
  "Expiring Soon": "bg-amber-50 text-amber-700 border-amber-200",
  "Partial": "bg-amber-50 text-amber-700 border-amber-200",
  "Pending": "bg-slate-100 text-slate-700 border-slate-200",
  "Not Invoiced": "bg-slate-100 text-slate-700 border-slate-200",
  "Not Started": "bg-slate-100 text-slate-600 border-slate-200",
  "Draft": "bg-slate-100 text-slate-600 border-slate-200",
  // Fail
  "Rejected": "bg-rose-50 text-rose-700 border-rose-200",
  "Fail": "bg-rose-50 text-rose-700 border-rose-200",
  "Lost": "bg-rose-50 text-rose-700 border-rose-200",
  "Disqualified": "bg-rose-50 text-rose-700 border-rose-200",
  "Expired": "bg-rose-50 text-rose-700 border-rose-200",
  "Suspended": "bg-rose-50 text-rose-700 border-rose-200",
  "Overdue": "bg-rose-50 text-rose-700 border-rose-200",
  "Cancelled": "bg-rose-50 text-rose-700 border-rose-200",
};

export function StatusPill({ status, className }: { status: string; className?: string }) {
  const cls = statusMap[status] || "bg-slate-100 text-slate-700 border-slate-200";
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", cls, className)}>
      {status}
    </span>
  );
}

export function SeverityBadge({ level }: { level: "low" | "medium" | "high" | "critical" }) {
  const map = {
    low: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-orange-100 text-orange-700",
    critical: "bg-rose-100 text-rose-700",
  };
  return <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded", map[level])}>{level}</span>;
}
