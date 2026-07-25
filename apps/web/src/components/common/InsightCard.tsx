import type { ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";

import { Badge, type badgeVariants } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  icon: ReactNode;
  category: string;
  categoryVariant?: NonNullable<VariantProps<typeof badgeVariants>["variant"]>;
  title: string;
  description: string;
  footer?: ReactNode;
  className?: string;
}

export function InsightCard({
  icon,
  category,
  categoryVariant = "secondary",
  title,
  description,
  footer,
  className,
}: InsightCardProps) {
  return (
    <Card className={cn("gap-3 py-4", className)}>
      <CardContent className="flex flex-col gap-2 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            {icon}
          </div>
          <Badge variant={categoryVariant} className="uppercase">
            {category}
          </Badge>
        </div>
        <h6 className="mt-1">{title}</h6>
        <p className="text-sm text-muted-foreground">{description}</p>
        {footer ? (
          <div className="mt-1 border-t border-border pt-2 text-xs text-muted-foreground">
            {footer}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
