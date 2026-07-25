import { StatTile } from "@/features/dashboard/components/StatTile";

export interface ResultStat {
  label: string;
  value: string;
  valueClassName?: string;
}

export function ResultStatGrid({ stats }: { stats: ResultStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <StatTile
          key={stat.label}
          label={stat.label}
          value={stat.value}
          valueClassName={stat.valueClassName}
        />
      ))}
    </div>
  );
}
