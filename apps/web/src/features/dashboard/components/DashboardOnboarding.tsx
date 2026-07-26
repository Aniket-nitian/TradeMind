import { useNavigate } from "react-router-dom";
import {
  Link2,
  PenLine,
  Percent,
  ShieldCheck,
  TrendingUp,
  Upload,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";

const ACTIONS = [
  {
    icon: PenLine,
    title: "Log a trade manually",
    description: "Record entries, exits, and the reasoning behind each trade.",
    to: "/trades/new",
  },
  {
    icon: Upload,
    title: "Import your trade history",
    description: "Upload a CSV export from Zerodha, Groww, Dhan, and more.",
    to: "/import",
  },
  {
    icon: Link2,
    title: "Connect your broker",
    description: "Auto-sync new trades so your journal stays current.",
    to: "/settings#broker",
  },
] as const;

const PREVIEW_TILES = [
  { icon: TrendingUp, label: "Equity curve" },
  { icon: Percent, label: "Win rate" },
  { icon: ShieldCheck, label: "Discipline score" },
  { icon: TrendingUp, label: "Max drawdown" },
] as const;

export function DashboardOnboarding() {
  const navigate = useNavigate();
  const firstName = useAuthStore((s) => s.user?.firstName);

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card">
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <div className="mb-1 flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <TrendingUp className="size-6" />
          </div>
          <h2 className="text-xl font-semibold">
            {firstName ? `Welcome, ${firstName}` : "Welcome to TradeMind AI"}
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Your dashboard is ready but empty. Log your first trade, import your history, or
            connect a broker below to see your performance come alive.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {ACTIONS.map(({ icon: Icon, title, description, to }) => (
          <button
            key={title}
            type="button"
            onClick={() => navigate(to)}
            className="group flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-5 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="size-5" />
            </div>
            <div>
              <p className="font-medium">{title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            </div>
          </button>
        ))}
      </div>

      <div>
        <p className="text-eyebrow mb-3">What you&apos;ll unlock</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PREVIEW_TILES.map(({ icon: Icon, label }, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-xl border border-dashed border-border p-4 opacity-60"
            >
              <Icon className="size-4 text-muted-foreground" />
              <span className="text-lg font-semibold text-muted-foreground">—</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
