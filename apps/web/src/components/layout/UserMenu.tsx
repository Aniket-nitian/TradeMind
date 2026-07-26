import { LogOut, Sparkles, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth-store";
import { useLogout, useProfile } from "@/features/auth/hooks";

export function UserMenu() {
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile();
  const logout = useLogout();

  const initials = user?.firstName?.[0]?.toUpperCase() ?? "?";
  const subscription = profile?.subscription;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="size-8">
          {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={user?.firstName} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-1">
            <span className="flex items-center gap-2">
              <UserIcon className="size-3.5" />
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              {user?.email}
            </span>
            {subscription && (
              <Badge
                variant={subscription === "PREMIUM" ? "default" : "secondary"}
                className="w-fit"
              >
                {subscription}
              </Badge>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {subscription !== "PREMIUM" && (
          <>
            <DropdownMenuItem render={<Link to="/settings#billing" />}>
              <Sparkles className="size-4" />
              Upgrade to Premium
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem
          variant="destructive"
          onClick={() => logout.mutate()}
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
