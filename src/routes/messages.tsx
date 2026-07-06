import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { threads as seedThreads } from "@/data/seed";
import { useState } from "react";
import { Send, Sparkles, Paperclip, MessageSquare, Mail, Smartphone } from "lucide-react";
import { relativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "Messages — Uganda GEP" }] }),
  component: MessagesPage,
});

const channels = [
  { id: "In-app", label: "In-app", icon: MessageSquare },
  { id: "WhatsApp", label: "WhatsApp", icon: Smartphone },
  { id: "Telegram", label: "Telegram", icon: Smartphone },
  { id: "Email", label: "Email", icon: Mail },
];

function MessagesPage() {
  const [channelF, setChannelF] = useState<string>("In-app");
  const [activeId, setActiveId] = useState(seedThreads[0].id);
  const [draft, setDraft] = useState("");

  const filtered = seedThreads.filter((t) => t.channel === channelF);
  const active = seedThreads.find((t) => t.id === activeId) ?? filtered[0];

  return (
    <AppShell>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#0D1F3C]">Messages</h1>
      </div>
      <Card className="rounded-xl overflow-hidden grid grid-cols-12 h-[calc(100vh-200px)]">
        {/* Channels */}
        <div className="col-span-2 border-r bg-slate-50 p-3 space-y-1">
          {channels.map((c) => {
            const count = seedThreads.filter((t) => t.channel === c.id).reduce((s, t) => s + t.unread, 0);
            const Icon = c.icon;
            return (
              <button key={c.id} onClick={() => setChannelF(c.id)}
                className={cn("w-full flex items-center gap-2 px-3 py-2 rounded text-sm", channelF === c.id ? "bg-white text-[#0D1F3C] font-medium shadow-sm" : "text-slate-600 hover:bg-white/50")}>
                <Icon className="h-4 w-4" /> {c.label}
                {count > 0 && <Badge className="ml-auto bg-[#EF4444] text-white text-[10px]">{count}</Badge>}
              </button>
            );
          })}
        </div>

        {/* Thread list */}
        <div className="col-span-4 border-r overflow-y-auto">
          {filtered.length === 0 && <div className="p-8 text-center text-sm text-slate-500">No messages on this channel.</div>}
          {filtered.map((t) => (
            <button key={t.id} onClick={() => setActiveId(t.id)}
              className={cn("w-full text-left p-3 border-b hover:bg-slate-50", activeId === t.id && "bg-slate-100")}>
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm">{t.fromName}</div>
                <div className="text-xs text-slate-400">{relativeTime(t.lastAt)}</div>
              </div>
              <div className={cn("text-xs mt-1 truncate", t.unread > 0 ? "font-semibold text-slate-900" : "text-slate-500")}>{t.subject}</div>
              {t.unread > 0 && <Badge className="mt-1 bg-[#EF4444] text-[10px]">{t.unread} new</Badge>}
            </button>
          ))}
        </div>

        {/* Thread */}
        <div className="col-span-6 flex flex-col">
          {active ? (
            <>
              <div className="p-4 border-b">
                <div className="font-semibold">{active.subject}</div>
                <div className="text-xs text-slate-500">{active.fromName} · {active.channel}</div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <Card className="p-3 rounded-lg border-l-4 border-l-[#F59E0B] bg-amber-50/50">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-[#F59E0B] mt-0.5" />
                    <div className="flex-1 text-sm">
                      <div className="font-medium">Suggested reply</div>
                      <div className="text-slate-600 mt-1">"Yes, I confirm delivery on Monday morning by 10am. Our driver will call ahead."</div>
                      <div className="flex gap-1 mt-2"><Button size="sm" variant="outline" onClick={() => setDraft("Yes, I confirm delivery on Monday morning by 10am. Our driver will call ahead.")}>Use</Button><Button size="sm" variant="ghost">Refine</Button><Button size="sm" variant="ghost">Dismiss</Button></div>
                    </div>
                  </div>
                </Card>
                {active.messages.map((m) => (
                  <div key={m.id} className={cn("flex", m.from === "me" ? "justify-end" : "")}>
                    <div className={cn("max-w-[80%] rounded-2xl p-3 text-sm", m.from === "me" ? "bg-[#0D1F3C] text-white" : "bg-slate-100")}>
                      <div className={cn("text-xs mb-1 opacity-70")}>{m.fromName} · {relativeTime(m.at)}</div>
                      {m.body}
                      {m.attachmentUrl && <div className="mt-2 flex items-center gap-1 text-xs opacity-80"><Paperclip className="h-3 w-3" /> {m.attachmentUrl}</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t flex gap-2">
                <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
                <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message..." />
                <Button className="bg-[#0D1F3C]" onClick={() => { toast.success("Reply sent"); setDraft(""); }}><Send className="h-4 w-4" /></Button>
              </div>
            </>
          ) : <div className="flex-1 flex items-center justify-center text-sm text-slate-500">Select a thread</div>}
        </div>
      </Card>
    </AppShell>
  );
}
