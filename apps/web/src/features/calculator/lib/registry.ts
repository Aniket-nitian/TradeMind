import {
  Landmark,
  Layers,
  PiggyBank,
  Receipt,
  Ruler,
  Scale,
  Target,
  TrendingUp,
  TrendingUpDown,
  Wallet,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType } from "react";

import { PositionSizeCalculator } from "../components/trading/PositionSizeCalculator";
import { RiskRewardCalculator } from "../components/trading/RiskRewardCalculator";
import { StockAverageCalculator } from "../components/trading/StockAverageCalculator";
import { BrokerageCalculator } from "../components/trading/BrokerageCalculator";
import { MarginCalculator } from "../components/trading/MarginCalculator";
import { PivotPointCalculator } from "../components/technical/PivotPointCalculator";
import { FibonacciCalculator } from "../components/technical/FibonacciCalculator";
import { CagrCalculator } from "../components/investment/CagrCalculator";
import { LumpsumCalculator } from "../components/investment/LumpsumCalculator";
import { SipCalculator } from "../components/investment/SipCalculator";
import { GoalCalculator } from "../components/investment/GoalCalculator";

export type CalculatorCategory = "trading" | "technical" | "investment";

export interface CalculatorEntry {
  id: string;
  category: CalculatorCategory;
  icon: LucideIcon;
  title: string;
  description: string;
  Component: ComponentType;
}

export const CATEGORY_LABELS: Record<CalculatorCategory, string> = {
  trading: "Trading",
  technical: "Technical",
  investment: "Investment",
};

export const calculatorRegistry: CalculatorEntry[] = [
  {
    id: "position-size",
    category: "trading",
    icon: Ruler,
    title: "Position Size",
    description: "Find how many shares to buy for a given risk budget.",
    Component: PositionSizeCalculator,
  },
  {
    id: "risk-reward",
    category: "trading",
    icon: Scale,
    title: "Risk / Reward",
    description: "Check the reward-to-risk ratio before you take a trade.",
    Component: RiskRewardCalculator,
  },
  {
    id: "stock-averaging",
    category: "trading",
    icon: Layers,
    title: "Stock Averaging",
    description: "Blend two buy lots into a single average price.",
    Component: StockAverageCalculator,
  },
  {
    id: "brokerage",
    category: "trading",
    icon: Receipt,
    title: "Brokerage & Net P&L",
    description: "Work out turnover, brokerage cost, and net P&L on a round trip.",
    Component: BrokerageCalculator,
  },
  {
    id: "margin",
    category: "trading",
    icon: Wallet,
    title: "Margin & Leverage",
    description: "See your buying power and margin usage for a leveraged trade.",
    Component: MarginCalculator,
  },
  {
    id: "pivot-point",
    category: "technical",
    icon: Waypoints,
    title: "Pivot Point",
    description: "Classic floor-trader pivot with two resistance and support levels.",
    Component: PivotPointCalculator,
  },
  {
    id: "fibonacci",
    category: "technical",
    icon: TrendingUpDown,
    title: "Fibonacci Retracement",
    description: "Standard retracement levels between a swing high and low.",
    Component: FibonacciCalculator,
  },
  {
    id: "cagr",
    category: "investment",
    icon: TrendingUp,
    title: "CAGR",
    description: "Annualized growth rate between an initial and final value.",
    Component: CagrCalculator,
  },
  {
    id: "lumpsum",
    category: "investment",
    icon: Landmark,
    title: "Lumpsum Investment",
    description: "Maturity value of a one-time investment, compounded annually.",
    Component: LumpsumCalculator,
  },
  {
    id: "sip",
    category: "investment",
    icon: PiggyBank,
    title: "SIP",
    description: "Maturity value of a monthly SIP, compounded monthly.",
    Component: SipCalculator,
  },
  {
    id: "goal-planning",
    category: "investment",
    icon: Target,
    title: "Goal Planning",
    description: "Required monthly SIP to reach a target corpus.",
    Component: GoalCalculator,
  },
];

export function getCalculatorEntry(id: string) {
  return calculatorRegistry.find((entry) => entry.id === id);
}
