import { SidebarContent } from "./SidebarContent";

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:flex-col">
      <SidebarContent />
    </aside>
  );
}
