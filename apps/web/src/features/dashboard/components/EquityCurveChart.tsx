import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { EquityPoint } from "../types";

const RANGES = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "1Y", days: 365 },
] as const;

export function EquityCurveChart({ data }: { data: EquityPoint[] }) {
  const [range, setRange] = useState<(typeof RANGES)[number]["label"]>("1M");

  const filtered = useMemo(() => {
    if (data.length === 0) return data;
    const days = RANGES.find((r) => r.label === range)!.days;
    const lastDate = new Date(data[data.length - 1].date);
    const cutoff = new Date(lastDate);
    cutoff.setDate(cutoff.getDate() - days);
    return data.filter((d) => new Date(d.date) >= cutoff);
  }, [data, range]);

  return (
    <div>
      <div className="mb-3 flex justify-end gap-1">
        {RANGES.map((r) => (
          <Button
            key={r.label}
            size="sm"
            variant={range === r.label ? "default" : "outline"}
            className={cn("h-7 px-2.5 text-xs")}
            onClick={() => setRange(r.label)}
          >
            {r.label}
          </Button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={filtered} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />

          <XAxis
            dataKey="date"
            tickFormatter={(v: string) => formatDate(v)}
            stroke="var(--chart-axis)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tickFormatter={(v: number) => formatCurrency(v)}
            stroke="var(--chart-axis)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={80}
          />

          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            labelFormatter={(label) => formatDate(String(label))}
            contentStyle={{
              background: "var(--popover)",
              color: "var(--popover-foreground)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              fontSize: 12,
            }}
          />

          <Bar dataKey="equity" radius={[4, 4, 0, 0]}>
            {filtered.map((point) => (
              <Cell
                key={point.date}
                fill={point.equity >= 0 ? "var(--chart-delta-good)" : "var(--chart-delta-critical)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
