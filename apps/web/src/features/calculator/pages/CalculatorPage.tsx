import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { CalculatorPickerCard } from "../components/CalculatorPickerCard";
import { CATEGORY_LABELS, calculatorRegistry, type CalculatorCategory } from "../lib/registry";

const CATEGORY_ORDER: CalculatorCategory[] = ["trading", "technical", "investment"];

export default function CalculatorPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return calculatorRegistry;
    return calculatorRegistry.filter(
      (entry) =>
        entry.title.toLowerCase().includes(q) || entry.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div>
      <PageHeader title="Calculators" description="Pick a tool to get started." />

      <div className="relative mb-6 max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search calculators…"
          className="pl-8"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No calculators match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {CATEGORY_ORDER.map((category) => {
            const entries = filtered.filter((entry) => entry.category === category);
            if (entries.length === 0) return null;

            return (
              <div key={category}>
                <p className="text-eyebrow mb-3">{CATEGORY_LABELS[category]}</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {entries.map((entry) => (
                    <CalculatorPickerCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
