import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn, formatCurrency, formatDate, pnlClass } from "@/lib/utils";
import { useTradeSearch } from "@/features/trades/hooks";

export function TradeSearch() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setQuery(input.trim()), 300);
    return () => clearTimeout(id);
  }, [input]);

  const { data: results, isLoading } = useTradeSearch(query);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const goTo = (id: string) => {
    setOpen(false);
    setInput("");
    navigate(`/trades/${id}`);
  };

  const showDropdown = open && query.length > 0;

  return (
    <div ref={containerRef} className="relative hidden max-w-xs flex-1 sm:block">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search trades…"
        className="pl-8"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            e.currentTarget.blur();
          } else if (e.key === "Enter" && results?.[0]) {
            goTo(results[0].id);
          }
        }}
      />

      {showDropdown && (
        <div className="absolute top-full left-0 z-50 mt-1.5 w-80 overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10">
          {isLoading && (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
              Searching…
            </div>
          )}

          {!isLoading && results?.length === 0 && (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
              No trades match &quot;{query}&quot;.
            </div>
          )}

          {!isLoading &&
            results?.map((trade) => (
              <button
                key={trade.id}
                type="button"
                onClick={() => goTo(trade.id)}
                className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  <Badge variant={trade.side === "BUY" ? "default" : "secondary"} className="shrink-0">
                    {trade.side}
                  </Badge>
                  <div className="flex flex-col">
                    <span className="font-medium">{trade.symbol}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(trade.entryTime)}
                    </span>
                  </div>
                </div>
                <span className={cn("shrink-0 text-sm font-semibold", pnlClass(trade.netPnl))}>
                  {trade.netPnl === null ? "OPEN" : formatCurrency(trade.netPnl)}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
