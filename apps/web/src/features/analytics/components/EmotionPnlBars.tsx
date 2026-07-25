import { EMOTION_META } from "@/lib/emotion-meta";
import { formatCurrency, pnlClass } from "@/lib/utils";
import type { Emotion } from "@/lib/constants";
import type { PsychologyPerformance } from "../types";

export function EmotionPnlBars({ data }: { data: PsychologyPerformance[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">No emotion-tagged trades yet.</p>;
  }

  const maxAbs = Math.max(...data.map((e) => Math.abs(e.netPnL)), 1);

  return (
    <div className="flex flex-col gap-3">
      {data.map((e) => {
        const meta = EMOTION_META[e.emotion as Emotion];
        const widthPct = (Math.abs(e.netPnL) / maxAbs) * 100;
        return (
          <div key={e.emotion}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-medium">
                {meta?.emoji} {meta?.label ?? e.emotion}
              </span>
              <span className={pnlClass(e.netPnL)}>{formatCurrency(e.netPnL)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${widthPct}%`,
                  background: e.netPnL >= 0 ? "var(--chart-delta-good)" : "var(--chart-delta-critical)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
