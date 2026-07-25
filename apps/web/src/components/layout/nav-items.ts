import {
  LayoutDashboard,
  NotebookPen,
  BarChart3,
  Briefcase,
  Layers,
  Calculator,
  Sunrise,
  ScrollText,
  Brain,
  MessageCircle,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/daily-brief", label: "Daily Brief", icon: Sunrise },
  { to: "/trades", label: "Journal", icon: NotebookPen },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/portfolio", label: "Portfolio", icon: Briefcase },
  { to: "/catalog", label: "Catalog", icon: Layers },
  { to: "/calculator", label: "Calculator", icon: Calculator },
  { to: "/psychology", label: "Psychology", icon: Brain },
  { to: "/journal-insights", label: "Journal Insights", icon: ScrollText },
  { to: "/chat", label: "AI Chat", icon: MessageCircle },
  { to: "/settings", label: "Settings", icon: Settings },
];
