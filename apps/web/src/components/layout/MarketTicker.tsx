import { useEffect, useRef, useState } from "react";
import { Clock, ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { useMarketIndices } from "@/features/market/hooks";

function formatIndexPrice(value: number) {
  return value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function isNseOpen(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value;
  const hour = Number(parts.find((p) => p.type === "hour")?.value);
  const minute = Number(parts.find((p) => p.type === "minute")?.value);
  const minutesSinceMidnight = hour * 60 + minute;
  const isWeekday = weekday !== "Sat" && weekday !== "Sun";
  return isWeekday && minutesSinceMidnight >= 9 * 60 + 15 && minutesSinceMidnight <= 15 * 60 + 30;
}

function MarketClock() {
  const now = useClock();
  const open = isNseOpen(now);

  const time = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now);

  const date = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(now);

  return (
    <div
      className={cn(
        "ml-1 flex min-w-[280px] flex-1 items-center justify-between gap-3 rounded-lg border-l-2 px-4 py-2",
        open ? "border-success bg-success/10" : "border-destructive bg-destructive/10"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            open ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
          )}
        >
          <Clock className="size-5" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-mono text-xl font-bold tabular-nums">{time}</span>
          <span className="text-xs whitespace-nowrap text-muted-foreground">{date} &middot; IST</span>
        </div>
      </div>

      <span
        className={cn(
          "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap",
          open ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
        )}
      >
        <span className={cn("size-1.5 rounded-full", open ? "bg-success" : "bg-destructive")} />
        {open ? "Market open" : "Market closed"}
      </span>
    </div>
  );
}

export function MarketTicker() {
  const { data, isLoading } = useMarketIndices();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (!isLoading && (!data || data.length === 0)) {
    return null;
  }

  return (
    <div className="relative flex items-center gap-1 border-b border-border bg-card/50 px-2 py-2">
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollBy(-240)}
        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-card text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
      </button>

      <div
        ref={scrollerRef}
        className="flex min-w-0 shrink gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 w-40 shrink-0 animate-pulse rounded-lg bg-muted"
            />
          ))}

        {data?.map((index) => {
          const isPositive = index.change >= 0;
          return (
            <div
              key={index.symbol}
              className={cn(
                "flex w-44 shrink-0 flex-col gap-0.5 rounded-lg px-3 py-2",
                isPositive
                  ? "bg-success/10"
                  : "bg-destructive/10"
              )}
            >
              <span className="text-eyebrow">{index.name}</span>
              <span className="text-base font-semibold">{formatIndexPrice(index.price)}</span>
              <span
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  isPositive ? "text-success" : "text-destructive"
                )}
              >
                {isPositive ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {isPositive ? "+" : ""}
                {index.change.toFixed(2)} ({isPositive ? "+" : ""}
                {index.changePercent.toFixed(2)}%)
              </span>
            </div>
          );
        })}
      </div>

      <MarketClock />

      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollBy(240)}
        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-card text-muted-foreground hover:text-foreground"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
