import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div>
        <h1>{title}</h1>
        {description && <p className="text-muted mt-1">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
