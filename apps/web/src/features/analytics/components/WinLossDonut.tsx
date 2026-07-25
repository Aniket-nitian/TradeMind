import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { WinLossDistribution } from "../types";

export function WinLossDonut({ data }: { data: WinLossDistribution }) {
  const total = data.wins + data.losses + data.breakeven;
  const chartData = [
    { name: "Wins", value: data.wins, color: "var(--chart-delta-good)" },
    { name: "Losses", value: data.losses, color: "var(--chart-delta-critical)" },
    { name: "Breakeven", value: data.breakeven, color: "var(--muted-foreground)" },
  ].filter((d) => d.value > 0);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            strokeWidth={0}
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--popover)",
              color: "var(--popover-foreground)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold">{total}</span>
        <span className="text-eyebrow">Total trades</span>
      </div>
      <div className="mt-2 flex justify-center gap-4 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full" style={{ background: "var(--chart-delta-good)" }} />
          Wins {data.wins}
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="size-2 rounded-full"
            style={{ background: "var(--chart-delta-critical)" }}
          />
          Losses {data.losses}
        </span>
      </div>
    </div>
  );
}
