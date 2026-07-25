import { formatCurrency, formatDate } from "@/lib/utils";
import { heatmapColor } from "../lib/heatmap-scale";
import type { CalendarDay } from "../types";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function TimeHeatmapGrid({ data }: { data: CalendarDay[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">No closed trades yet.</p>;
  }

  const byDate = new Map(data.map((d) => [d.date, d]));
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.netPnL)), 1);

  const dates = data.map((d) => new Date(d.date));
  const start = new Date(Math.min(...dates.map((d) => d.getTime())));
  const end = new Date(Math.max(...dates.map((d) => d.getTime())));

  const startOfGrid = new Date(start);
  startOfGrid.setDate(startOfGrid.getDate() - startOfGrid.getDay());

  const weeks: Date[][] = [];
  const cursor = new Date(startOfGrid);
  while (cursor <= end) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3">
        <div className="flex flex-col gap-1 pt-4 text-[10px] text-muted-foreground">
          {DAY_LABELS.map((label) => (
            <div key={label} className="flex h-3 items-center">
              {label}
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((date) => {
                const key = date.toISOString().split("T")[0];
                const day = byDate.get(key);
                return (
                  <div
                    key={key}
                    title={
                      day
                        ? `${formatDate(key)}: ${formatCurrency(day.netPnL)} (${day.trades} trades)`
                        : formatDate(key)
                    }
                    className="size-3 rounded-sm"
                    style={{
                      background: day ? heatmapColor(day.netPnL, maxAbs) : "var(--muted)",
                      opacity: day ? 1 : 0.3,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
