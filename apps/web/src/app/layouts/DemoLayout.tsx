import { useMemo } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { BarChart3, Calculator, LayoutDashboard, NotebookPen, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MarketNewsTicker } from "@/components/layout/MarketNewsTicker";
import { MarketTicker } from "@/components/layout/MarketTicker";
import { createDemoQueryClient } from "@/features/demo/demo-query-client";
import { DemoModeProvider } from "@/features/demo/DemoModeContext";

const DEMO_NAV_ITEMS = [
  { to: "/demo/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/demo/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/demo/trades", label: "Journal", icon: NotebookPen },
  { to: "/calculator", label: "Calculator", icon: Calculator },
];

export default function DemoLayout() {
  const navigate = useNavigate();
  const queryClient = useMemo(() => createDemoQueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <DemoModeProvider>
        <div className="flex h-screen overflow-hidden bg-background">
          <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
            <div className="flex h-14 items-center gap-2 px-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <TrendingUp className="size-4" />
              </div>
              <span className="text-base font-semibold">TradeMind AI</span>
            </div>

            <nav className="flex flex-1 flex-col gap-1 px-2 py-2">
              {DEMO_NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/15 text-primary"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )
                  }
                >
                  <Icon className="size-4" />
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="flex flex-col gap-2 border-t border-sidebar-border p-3">
              <p className="px-1 text-xs text-muted-foreground">
                You&apos;re viewing a live sample. Sign up to use it with your own trades.
              </p>
              <Button size="sm" onClick={() => navigate("/register")}>
                Create free account
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate("/login")}>
                Log in
              </Button>
            </div>
          </aside>

          <div className="flex flex-1 flex-col overflow-hidden">
            <header className="flex h-14 items-center gap-3 border-b border-border px-4">
              <div className="flex items-center gap-2 md:hidden">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <TrendingUp className="size-3.5" />
                </div>
                <span className="text-sm font-semibold">TradeMind AI</span>
              </div>

              <span className="hidden text-sm text-muted-foreground sm:block">
                Live sample data — nothing here is saved.
              </span>

              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => navigate("/login")}>
                  Log in
                </Button>
                <Button size="sm" onClick={() => navigate("/register")}>
                  Sign up free
                </Button>
              </div>
            </header>

            <MarketNewsTicker />
            <MarketTicker />

            <main className="flex-1 overflow-y-auto p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </DemoModeProvider>
    </QueryClientProvider>
  );
}
