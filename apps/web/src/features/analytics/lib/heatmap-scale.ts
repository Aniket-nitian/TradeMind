export function heatmapColor(netPnL: number, maxAbs: number): string {
  if (netPnL === 0 || maxAbs === 0) return "var(--muted)";
  const intensity = Math.min(Math.abs(netPnL) / maxAbs, 1);
  const opacity = 0.25 + intensity * 0.75;
  const varName = netPnL > 0 ? "--chart-delta-good" : "--chart-delta-critical";
  return `color-mix(in oklch, var(${varName}) ${Math.round(opacity * 100)}%, var(--card))`;
}
