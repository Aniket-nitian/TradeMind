import { Newspaper } from "lucide-react";

import { cn } from "@/lib/utils";
import { useMarketNews } from "@/features/news/hooks";
import type { MarketNewsItem } from "@/features/news/types";

function sentimentDotClass(sentiment: MarketNewsItem["sentiment"]) {
  if (sentiment === "POSITIVE") return "bg-success";
  if (sentiment === "NEGATIVE") return "bg-destructive";
  return "bg-muted-foreground";
}

function TickerHeadline({ item }: { item: MarketNewsItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex shrink-0 items-center gap-2 px-4 text-sm whitespace-nowrap hover:text-foreground"
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", sentimentDotClass(item.sentiment))} />
      <span className="text-foreground/90">{item.headline}</span>
      <span className="text-xs text-muted-foreground">— {item.source}</span>
    </a>
  );
}

export function MarketNewsTicker() {
  const { data, isLoading } = useMarketNews();
  const items = data?.items ?? [];

  if (!isLoading && items.length === 0) {
    return null;
  }

  const duration = Math.max(30, items.length * 6);

  return (
    <div className="group flex items-center gap-3 overflow-hidden border-b border-border bg-card/50 py-2 pl-3">
      <div className="flex shrink-0 items-center gap-1.5 border-r border-border pr-3">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive/70" />
          <span className="relative inline-flex size-2 rounded-full bg-destructive" />
        </span>
        <Newspaper className="size-3.5 text-muted-foreground" />
        <span className="text-eyebrow whitespace-nowrap">Market News</span>
      </div>

      {isLoading ? (
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <div
            className="animate-marquee flex shrink-0 group-hover:[animation-play-state:paused]"
            style={{ animationDuration: `${duration}s` }}
          >
            {items.map((item, i) => (
              <TickerHeadline key={`a-${i}`} item={item} />
            ))}
            {items.map((item, i) => (
              <TickerHeadline key={`b-${i}`} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
