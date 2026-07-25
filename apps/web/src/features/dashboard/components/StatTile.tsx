import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatTile({
  label,
  value,
  valueClassName,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  icon?: LucideIcon;
  iconClassName?: string;
}) {
  return (
    <Card className="transition-shadow hover:shadow-lg hover:shadow-black/20">
      <CardContent className="flex flex-col gap-1 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{label}</p>
          {Icon && (
            <div
              className={cn(
                "flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary",
                iconClassName
              )}
            >
              <Icon className="size-3.5" />
            </div>
          )}
        </div>
        <p className={cn("text-2xl font-semibold", valueClassName)}>{value}</p>
      </CardContent>
    </Card>
  );
}
