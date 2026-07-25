import { Outlet } from "react-router-dom";
import { TrendingUp } from "lucide-react";

import { AuthShowcase } from "@/features/auth/components/AuthShowcase";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-background lg:h-screen lg:overflow-hidden">
      <AuthShowcase />

      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-12">
        <div className="flex w-full max-w-sm flex-col gap-8">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <TrendingUp className="size-4" />
            </div>
            <span className="text-base font-semibold">TradeMind AI</span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
