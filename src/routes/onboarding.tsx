import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StageStepper } from "@/components/shared/StageStepper";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/shared/StatusPill";
import { AgentVerdictItem } from "@/components/shared/AgentVerdictItem";
import { AlertBanner } from "@/components/shared/AlertBanner";
import { useAppStore } from "@/store/app-store";
import { toast } from "sonner";
import { FileUp, MessageSquare, ChevronRight, Building2, Upload, CreditCard } from "lucide-react";
import { currentSupplier } from "@/data/seed";
import { relativeTime } from "@/lib/format";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import type { Stage, RequiredAction } from "@/types";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding — Uganda GEP" }] }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const journey = useAppStore((s) => s.journey);
  const advance = useAppStore((s) => s.advanceStage);
  const scrollTo = (stage: Stage) => {
    document.getElementById(`stage-${stage}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0D1F3C]">My onboarding journey</h1>
        <p className="text-sm text-slate-500">Complete each stage to go live on the platform.</p>
      </div>

      <Card className="p-5 rounded-xl mb-6 bg-white sticky top-16 z-20">
        <div className="overflow-x-auto pb-2">
          <StageStepper onClick={(s) => scrollTo(s as Stage)} />
        </div>
      </Card>

      <div className="space-y-4">
        {journey.map((s) => (
          <StageCard key={s.stage} stageData={s} onSubmit={() => { advance(s.stage); toast.success(`Stage submitted for review`, { description: "Expected review: 24-48h." }); }} />
        ))}
      </div>
    </AppShell>
  );
}

function StageCard({ stageData, onSubmit }: { stageData: import("@/types").JourneyStage; onSubmit: () => void }) {
  const [expanded, setExpanded] = useState(stageData.status === "In Progress" || stageData.status === "Under Review");
  const done = stageData.requiredActions.filter((a) => a.completed).length;
  const total = stageData.requiredActions.length;

  return (
    <Card id={`stage-${stageData.stage}`} className="rounded-xl overflow-hidden scroll-mt-32">
      <button onClick={() => setExpanded(!expanded)} className="w-full p-5 flex items-center gap-4 text-left hover:bg-slate-50">
        <div className="text-2xl font-bold text-slate-300 w-8">{["Account","Identity","Documents","Category","Banking","Catalogue","PPDA"].indexOf(stageData.stage) + 1}</div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#0D1F3C]">{stageData.stage}</span>
            <StatusPill status={stageData.status} />
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {stageData.startedAt && `Started ${relativeTime(stageData.startedAt)}`}
            {stageData.completedAt && ` · Completed ${relativeTime(stageData.completedAt)}`}
            {total > 0 && ` · ${done}/${total} tasks done`}
          </div>
        </div>
        <ChevronRight className={`h-5 w-5 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>

      {expanded && (
        <div className="border-t bg-slate-50/50 p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* A — Required */}
          <div>
            <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Requirements ({done}/{total})</div>
            <div className="space-y-2">
              {stageData.requiredActions.map((a) => <ActionRow key={a.id} action={a} />)}
              {stageData.requiredActions.length === 0 && <div className="text-sm text-slate-500">No pending actions.</div>}
            </div>
            <StageBody stage={stageData.stage} />
          </div>

          {/* B — Agent activity */}
          <div>
            <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Agent activity</div>
            <Card className="p-3 rounded-lg">
              {stageData.agentVerdicts.length > 0
                ? stageData.agentVerdicts.map((v, i) => <AgentVerdictItem key={i} verdict={v} />)
                : <div className="text-sm text-slate-500 py-3">No agent activity yet.</div>}
            </Card>

            {/* C — Ops notes */}
            {stageData.opsNote && (
              <div className="mt-4">
                <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Ops note</div>
                <Card className="p-3 rounded-lg border-l-4 border-l-[#0D1F3C]">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-[#0D1F3C] mt-0.5" />
                    <div className="text-sm">{stageData.opsNote}</div>
                  </div>
                  <Button variant="link" size="sm" className="px-0 h-auto mt-2 text-[#0D1F3C]">Reply →</Button>
                </Card>
              </div>
            )}

            {/* D — Next step CTA */}
            <div className="mt-4">
              {stageData.status === "In Progress" && (
                <Button onClick={onSubmit} className="w-full bg-[#0D1F3C] hover:bg-[#0D1F3C]/90" disabled={done < total}>
                  {done < total ? `Complete ${total - done} more tasks` : "Submit for review"}
                </Button>
              )}
              {stageData.status === "Under Review" && <Button disabled className="w-full">Awaiting Ops review</Button>}
              {stageData.status === "Approved" && <Button disabled className="w-full bg-emerald-500">Approved ✓</Button>}
              {stageData.status === "Not Started" && <Button disabled className="w-full">{stageData.blockedReason ?? "Complete previous stages first"}</Button>}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function ActionRow({ action }: { action: RequiredAction }) {
  return (
    <label className="flex items-start gap-2 p-2 rounded hover:bg-white cursor-pointer">
      <Checkbox checked={action.completed} className="mt-0.5" />
      <div className="flex-1 text-sm">
        <div className={action.completed ? "line-through text-slate-400" : ""}>{action.label}</div>
      </div>
      <span className="text-xs text-slate-400 uppercase">{action.type}</span>
    </label>
  );
}

function StageBody({ stage }: { stage: Stage }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: () => setTimeout(() => toast.success("Document uploaded (mock)"), 1000),
  });

  const Dropzone = ({ label }: { label: string }) => (
    <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer text-sm ${isDragActive ? "border-[#0D1F3C] bg-slate-50" : "border-slate-200 hover:border-slate-300"}`}>
      <input {...getInputProps()} />
      <Upload className="h-5 w-5 mx-auto text-slate-400 mb-1" />
      <div className="text-slate-600">{label}</div>
      <div className="text-xs text-slate-400">Drag & drop or click</div>
    </div>
  );

  return (
    <div className="mt-4 space-y-3">
      {stage === "Account" && (
        <Card className="p-3 rounded-lg space-y-2">
          <div className="text-xs text-slate-500">Signup info</div>
          <Input value={currentSupplier.contactEmail} readOnly />
          <Input value={currentSupplier.contactPhone} readOnly />
          <div className="text-xs text-emerald-600">✓ Email + phone OTP verified</div>
        </Card>
      )}
      {stage === "Identity" && (
        <Card className="p-3 rounded-lg space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs text-slate-500">URSB Number</label><Input value={currentSupplier.ursbNumber} readOnly /></div>
            <div><label className="text-xs text-slate-500">TIN</label><Input value={currentSupplier.tin} readOnly /></div>
          </div>
          <div className="bg-slate-50 p-2 rounded text-xs">
            <div className="flex items-center gap-1 font-medium mb-1"><Building2 className="h-3 w-3" /> URSB Agent findings</div>
            <div>Company: Nakawa Traders Ltd · Directors: 2 verified · Status: Active</div>
          </div>
        </Card>
      )}
      {stage === "Documents" && (
        <div className="grid grid-cols-2 gap-2">
          <Dropzone label="Tax Clearance" />
          <Dropzone label="Trade Licence" />
          <Dropzone label="Bank Letter" />
          <Dropzone label="NSSF Certificate" />
        </div>
      )}
      {stage === "Category" && (
        <Card className="p-3 rounded-lg space-y-2">
          <div><label className="text-xs text-slate-500">Primary category</label><Input value={currentSupplier.categoryPrimary} readOnly /></div>
          <div><label className="text-xs text-slate-500">Secondary category</label><Input value={currentSupplier.categorySecondary} readOnly /></div>
          <Dropzone label="NDA Certification (Medical requires this)" />
        </Card>
      )}
      {stage === "Banking" && (
        <Card className="p-3 rounded-lg space-y-2">
          <div><label className="text-xs text-slate-500">Bank Account</label><Input value={currentSupplier.bankAccount} readOnly /></div>
          <div><label className="text-xs text-slate-500">Mobile Money</label><Input value={currentSupplier.mobileMoney} readOnly /></div>
          <div className="text-xs text-emerald-600">✓ Bank name matches business. Micro-deposit confirmed.</div>
        </Card>
      )}
      {stage === "Catalogue" && (
        <AlertBanner variant="info" title="3 of 10 products published" body="Publish 7 more products and submit for review to advance." actions={<Button size="sm" asChild><a href="/catalogue">Go to Catalogue</a></Button>} />
      )}
      {stage === "PPDA" && (
        <Card className="p-3 rounded-lg space-y-2">
          <div className="flex items-center justify-between p-3 bg-amber-50 rounded">
            <div>
              <div className="font-medium text-sm">Registration fee</div>
              <div className="text-xs text-slate-600">UGX 250,000 · Payable via MTN MoMo / Bank</div>
            </div>
            <Button size="sm" onClick={() => toast.success("Payment initiated (mock)")}><CreditCard className="h-3 w-3 mr-1" /> Pay now</Button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-2"><Checkbox /> Women-led (evidence req.)</label>
            <label className="flex items-center gap-2"><Checkbox /> Youth-led</label>
            <label className="flex items-center gap-2"><Checkbox /> PWDs</label>
            <label className="flex items-center gap-2"><Checkbox defaultChecked /> SME</label>
          </div>
        </Card>
      )}
    </div>
  );
}
