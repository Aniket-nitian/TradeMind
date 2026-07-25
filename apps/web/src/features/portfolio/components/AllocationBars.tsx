import { formatCurrency } from "@/lib/utils";

export interface AllocationBarItem {
  label: string;
  value: number;
}

export function AllocationBars({
  items,
  emptyMessage,
}: {
  items: AllocationBarItem[];
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium">{item.label}</span>
            <span className="text-muted-foreground">{formatCurrency(item.value)}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
