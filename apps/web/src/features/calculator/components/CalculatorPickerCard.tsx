import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CalculatorEntry } from "../lib/registry";

export function CalculatorPickerCard({ entry }: { entry: CalculatorEntry }) {
  const navigate = useNavigate();
  const Icon = entry.icon;

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/calculator/${entry.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") navigate(`/calculator/${entry.id}`);
      }}
      className={cn(
        "group/picker cursor-pointer transition-colors hover:border-primary/40 hover:bg-accent/40",
        "ring-1 ring-foreground/10"
      )}
    >
      <CardContent className="flex items-start gap-3 px-4 py-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium">{entry.title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{entry.description}</p>
        </div>
        <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover/picker:translate-x-0.5 group-hover/picker:text-primary" />
      </CardContent>
    </Card>
  );
}
