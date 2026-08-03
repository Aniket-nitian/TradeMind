import { useEffect, useState } from "react";
import { Coins, LineChart, Target, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

const SLIDES = [
  {
    icon: LineChart,
    title: "Trade with Precision",
    description:
      "Log every trade with entry and exit reasoning, chart snapshots, and strategy tags — all in one journal built for serious traders.",
  },
  {
    icon: Target,
    title: "Build Real Discipline",
    description:
      "AI-powered psychology coaching flags emotional patterns and self-sabotage before they cost you money.",
  },
  {
    icon: Coins,
    title: "Grow Your Wealth",
    description:
      "Sync trades automatically across every broker and watch your equity curve climb, backed by data you can trust.",
  },
] as const;

const BAR_HEIGHTS = [30, 45, 38, 60, 50, 72, 58, 80, 65, 90, 76, 96];

export function AuthShowcase() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[active];
  const Icon = slide.icon;

  return (
    <div
      className="relative hidden h-full w-[46%] shrink-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-[oklch(0.22_0.045_260)] via-[oklch(0.16_0.03_260)] to-[oklch(0.11_0.02_260)] p-10 lg:flex"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom right, oklch(0.22 0.045 260), oklch(0.16 0.03 260), oklch(0.11 0.02 260))",
        backgroundSize: "36px 36px, 36px 36px, 100% 100%",
      }}
    >
      <div className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 -bottom-32 size-96 rounded-full bg-[oklch(0.72_0.17_152)]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-20 size-64 rounded-full bg-accent-violet/15 blur-3xl" />

      <div className="pointer-events-none absolute inset-x-10 bottom-28 flex h-28 items-end gap-1.5 opacity-[0.18]">
        {BAR_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className={cn(
              "w-2.5 flex-1 rounded-full bg-gradient-to-t to-transparent",
              i % 3 === 2 ? "from-accent-violet" : "from-primary"
            )}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      <div className="relative flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground">
          <TrendingUp className="size-5" />
        </div>
        <span className="text-lg font-semibold text-white">TradeMind AI</span>
      </div>

      <div key={active} className="animate-in fade-in slide-in-from-bottom-2 relative duration-700">
        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10 backdrop-blur-sm">
          <Icon className="size-7 text-white" />
        </div>
        <h2 className="max-w-md text-3xl leading-tight font-semibold text-white">{slide.title}</h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">{slide.description}</p>
      </div>

      <div className="relative flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show slide ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === active ? "w-6 bg-white" : "w-1.5 bg-white/25 hover:bg-white/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
