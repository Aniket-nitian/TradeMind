import { Link, NavLink } from "react-router-dom";
import { Crown, TrendingUp } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useProfile } from "@/features/auth/hooks";
import { navItems } from "./nav-items";

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile();

  const initials = user?.firstName?.[0]?.toUpperCase() ?? "?";
  const subscription = profile?.subscription;

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2 px-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <TrendingUp className="size-4" />
        </div>
        <span className="text-base font-semibold">TradeMind AI</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2 py-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
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

      <div className="mt-auto flex flex-col gap-2 border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={user?.firstName} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
          </div>
          {subscription && (
            <Badge variant={subscription === "PREMIUM" ? "default" : "secondary"}>
              {subscription}
            </Badge>
          )}
        </div>

        {subscription && subscription !== "PREMIUM" && (
          <Link
            to="/settings#billing"
            onClick={onNavigate}
            className={cn(buttonVariants({ size: "sm" }), "w-full")}
          >
            <Crown className="size-4" />
            Upgrade to Premium
          </Link>
        )}
      </div>
    </div>
  );
}
