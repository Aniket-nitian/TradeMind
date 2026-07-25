import { Download, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EMOTIONS } from "@/lib/constants";
import { EMOTION_META } from "@/lib/emotion-meta";
import { useStrategies } from "@/features/strategies/hooks";
import { useBrokerAccounts } from "@/features/broker/hooks";
import { BROKER_LABELS } from "@/features/broker/types";

export const MANUAL_SOURCE = "MANUAL";

export interface TradeFilters {
  strategyId?: string;
  emotion?: string;
  from?: string;
  to?: string;
  broker?: string;
}

interface TradeFilterBarProps {
  filters: TradeFilters;
  onChange: (filters: TradeFilters) => void;
  onExport: () => void;
}

export function TradeFilterBar({ filters, onChange, onExport }: TradeFilterBarProps) {
  const { data: strategies } = useStrategies();
  const { data: brokerAccounts } = useBrokerAccounts();

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <Filter className="size-4 text-muted-foreground" />

      <input
        type="date"
        value={filters.from ?? ""}
        onChange={(e) => onChange({ ...filters, from: e.target.value || undefined })}
        className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label="From date"
      />
      <span className="text-sm text-muted-foreground">to</span>
      <input
        type="date"
        value={filters.to ?? ""}
        onChange={(e) => onChange({ ...filters, to: e.target.value || undefined })}
        className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label="To date"
      />

      <Select
        value={filters.strategyId}
        onValueChange={(v) => onChange({ ...filters, strategyId: v ?? undefined })}
      >
        <SelectTrigger className="h-8">
          <SelectValue placeholder="Strategy: All" />
        </SelectTrigger>
        <SelectContent>
          {strategies?.length ? (
            strategies.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))
          ) : (
            <div className="px-2 py-3 text-center text-xs text-muted-foreground">
              No strategies yet — add some in Catalog.
            </div>
          )}
        </SelectContent>
      </Select>

      <Select
        value={filters.emotion}
        onValueChange={(v) => onChange({ ...filters, emotion: v ?? undefined })}
      >
        <SelectTrigger className="h-8">
          <SelectValue placeholder="Emotion: All" />
        </SelectTrigger>
        <SelectContent>
          {EMOTIONS.map((e) => (
            <SelectItem key={e} value={e}>
              {EMOTION_META[e].emoji} {EMOTION_META[e].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.broker}
        onValueChange={(v) => onChange({ ...filters, broker: v ?? undefined })}
      >
        <SelectTrigger className="h-8">
          <SelectValue placeholder="Source: All" />
        </SelectTrigger>
        <SelectContent>
          {brokerAccounts?.map((account) => (
            <SelectItem key={account.broker} value={account.broker}>
              {BROKER_LABELS[account.broker]}
            </SelectItem>
          ))}
          <SelectItem value={MANUAL_SOURCE}>Manual</SelectItem>
        </SelectContent>
      </Select>

      {(filters.strategyId || filters.emotion || filters.from || filters.to || filters.broker) && (
        <Button variant="ghost" size="sm" onClick={() => onChange({})}>
          Clear filters
        </Button>
      )}

      <Button variant="outline" size="sm" className="ml-auto" onClick={onExport}>
        <Download className="size-4" />
        Export CSV
      </Button>
    </div>
  );
}
