export function DisciplineGauge({ value, label }: { value: number | null; label: string }) {
  const pct = value ?? 0;
  const color =
    pct >= 70 ? "var(--success)" : pct >= 40 ? "var(--warning)" : "var(--destructive)";

  return (
    <div className="flex items-center gap-3">
      <div
        className="relative flex size-16 shrink-0 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(${color} ${pct * 3.6}deg, var(--muted) 0deg)`,
        }}
      >
        <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-card">
          <span className="text-lg font-semibold">{value === null ? "—" : pct}</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-eyebrow">{label}</span>
        <span className="text-xs text-muted-foreground">
          {value === null ? "No journal data yet" : "Trades that followed plan"}
        </span>
      </div>
    </div>
  );
}
