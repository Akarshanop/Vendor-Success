import type { ReactNode } from "react";
import { Sidebar, TopHeader } from "./Sidebar";
import { AIAssistantDrawer } from "@/components/shared/AIAssistantDrawer";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { Toaster } from "sonner";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F7F8FC] text-slate-900" style={{ fontFamily: "Inter, sans-serif" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 p-6 min-w-0">{children}</main>
      </div>
      <AIAssistantDrawer />
      <CommandPalette />
      <Toaster position="top-right" richColors />
    </div>
  );
}
