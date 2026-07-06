import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import type { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: ReactNode;
  delta?: string;
  deltaDirection?: "up" | "down" | "flat";
  sparkline?: number[];
  cta?: { label: string; to: string };
  subtitle?: string;
  color?: string;
}

export function KpiCard({ title, value, delta, deltaDirection, sparkline, cta, subtitle, color = "#0EA5E9" }: KpiCardProps) {
  const data = sparkline?.map((v, i) => ({ i, v })) ?? [];
  return (
    <Card className="p-4 rounded-xl hover:shadow-md transition-shadow flex flex-col gap-2">
      <div className="text-xs text-slate-500 font-medium">{title}</div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <div className="text-2xl font-bold text-[#0D1F3C]">{value}</div>
          {subtitle && <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>}
          {delta && (
            <div className={`text-xs mt-1 flex items-center gap-1 ${deltaDirection === "up" ? "text-emerald-600" : deltaDirection === "down" ? "text-rose-600" : "text-slate-500"}`}>
              {deltaDirection === "up" && <TrendingUp className="h-3 w-3" />}
              {deltaDirection === "down" && <TrendingDown className="h-3 w-3" />}
              {delta}
            </div>
          )}
        </div>
        {data.length > 0 && (
          <div className="w-24 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      {cta && (
        <Button asChild variant="ghost" size="sm" className="justify-between mt-1 -mx-2 text-[#0D1F3C]">
          <Link to={cta.to}>{cta.label} <ArrowRight className="h-3 w-3" /></Link>
        </Button>
      )}
    </Card>
  );
}
