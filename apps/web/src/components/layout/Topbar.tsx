import { MobileSidebar } from "./MobileSidebar";
import { NotificationsMenu } from "./NotificationsMenu";
import { TradeSearch } from "./TradeSearch";
import { UserMenu } from "./UserMenu";

export function Topbar() {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-border px-4">
      <MobileSidebar />

      <TradeSearch />

      <div className="ml-auto flex items-center gap-1">
        <NotificationsMenu />
        <UserMenu />
      </div>
    </header>
  );
}
