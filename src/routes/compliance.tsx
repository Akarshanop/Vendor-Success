import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { StatusPill } from "@/components/shared/StatusPill";
import { AlertBanner } from "@/components/shared/AlertBanner";
import { Switch } from "@/components/ui/switch";
import { certifications } from "@/data/seed";
import { fmtDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/compliance")({
  head: () => ({ meta: [{ title: "Compliance — Uganda GEP" }] }),
  component: CompliancePage,
});

function CompliancePage() {
  const certs = certifications.filter((c) => c.kind === "certification");
  const docs = certifications.filter((c) => c.kind === "document");
  const expiring = certifications.filter((c) => c.status === "Expiring Soon").length;
  const expired = certifications.filter((c) => c.status === "Expired").length;

  return (
    <AppShell>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#0D1F3C]">Certifications & Documents</h1>
        <p className="text-sm text-slate-500">Keep everything current to maximise tender eligibility.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <Card className="p-3"><div className="text-xs text-slate-500">Overall compliance</div><div className="text-xl font-bold text-emerald-600">82%</div></Card>
        <Card className="p-3"><div className="text-xs text-slate-500">Expiring in 30d</div><div className="text-xl font-bold text-amber-600">{expiring}</div></Card>
        <Card className="p-3"><div className="text-xs text-slate-500">Expired</div><div className="text-xl font-bold text-rose-600">{expired}</div></Card>
      </div>

      {expired > 0 && (
        <AlertBanner variant="danger" title={`${expired} document is expired`} body="Some tenders are unavailable while this is expired." actions={<Button size="sm" className="bg-rose-600 hover:bg-rose-700">Renew now</Button>} className="mb-4" />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CertTable title="Certifications" items={certs} />
        <CertTable title="Documents" items={docs} />
      </div>

      <Card className="mt-4 p-4 rounded-xl flex items-center justify-between">
        <div>
          <div className="font-medium">Auto-reminders</div>
          <div className="text-xs text-slate-500">Notify me 90 / 60 / 30 days before expiry</div>
        </div>
        <Switch defaultChecked />
      </Card>
    </AppShell>
  );
}

function CertTable({ title, items }: { title: string; items: typeof certifications }) {
  return (
    <Card className="rounded-xl overflow-hidden">
      <div className="p-4 border-b font-semibold text-[#0D1F3C]">{title}</div>
      <Table>
        <TableHeader><TableRow>
          <TableHead>Name</TableHead><TableHead>Expiry</TableHead><TableHead>Days</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {items.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <div className="font-medium text-sm">{c.name}</div>
                <div className="text-xs text-slate-500">{c.issuer} · {c.number}</div>
              </TableCell>
              <TableCell className="text-sm">{fmtDate(c.expiryDate)}</TableCell>
              <TableCell className={cn("text-sm font-medium", c.daysToExpiry < 0 ? "text-rose-600" : c.daysToExpiry < 60 ? "text-amber-600" : "text-emerald-600")}>{c.daysToExpiry < 0 ? `${Math.abs(c.daysToExpiry)}d ago` : `${c.daysToExpiry}d`}</TableCell>
              <TableCell><StatusPill status={c.status} /></TableCell>
              <TableCell><Button size="sm" variant="outline" onClick={() => toast.success(`Renewal started for ${c.name}`)}>Renew</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
