import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/utils";
import type { ConfidenceBucket } from "../types";

export function ConfidenceChart({ data }: { data: ConfidenceBucket[] }) {
  const hasData = data.some((d) => d.trades > 0);

  if (!hasData) {
    return <p className="text-sm text-muted-foreground">Not enough trades yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
        <XAxis
          dataKey="confidence"
          tickFormatter={(v) => String(v)}
          stroke="var(--chart-axis)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          label={{ value: "Confidence (1–10)", position: "insideBottom", offset: -2, fontSize: 11, fill: "var(--chart-axis)" }}
        />
        <YAxis
          tickFormatter={(v) => formatCurrency(Number(v))}
          stroke="var(--chart-axis)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <ReferenceLine y={0} stroke="var(--chart-axis)" strokeDasharray="4 4" />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          labelFormatter={(label) => `Confidence ${label}`}
          contentStyle={{
            background: "var(--popover)",
            color: "var(--popover-foreground)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="netPnL"
          stroke="var(--accent-violet)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
