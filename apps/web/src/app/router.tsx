import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import DemoLayout from "./layouts/DemoLayout";
import { ProtectedRoute } from "./routes/protected-route";
import { PublicOnlyRoute } from "./routes/public-route";
import { RootRedirect } from "./routes/RootRedirect";

import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import VerifyEmailPage from "@/features/auth/pages/VerifyEmailPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import TradeListPage from "@/features/trades/pages/TradeListPage";
import TradeDetailPage from "@/features/trades/pages/TradeDetailPage";
import TradeFormPage from "@/features/trades/pages/TradeFormPage";
import ChatPage from "@/features/chat/pages/ChatPage";
import AnalyticsPage from "@/features/analytics/pages/AnalyticsPage";
import PsychologyPage from "@/features/psychology-coach/pages/PsychologyPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import CsvImportPage from "@/features/csv-import/pages/CsvImportPage";
import CalculatorPage from "@/features/calculator/pages/CalculatorPage";
import CalculatorDetailPage from "@/features/calculator/pages/CalculatorDetailPage";
import PortfolioPage from "@/features/portfolio/pages/PortfolioPage";
import CatalogPage from "@/features/catalog/pages/CatalogPage";
import NotificationListPage from "@/features/notifications/pages/NotificationListPage";
import DailyBriefPage from "@/features/daily-brief/pages/DailyBriefPage";
import JournalInsightsPage from "@/features/journal-insights/pages/JournalInsightsPage";

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <RegisterPage /> },
          { path: "/forgot-password", element: <ForgotPasswordPage /> },
          { path: "/reset-password", element: <ResetPasswordPage /> },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [{ path: "/verify-email", element: <VerifyEmailPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/trades", element: <TradeListPage /> },
          { path: "/trades/new", element: <TradeFormPage /> },
          { path: "/trades/:id", element: <TradeDetailPage /> },
          { path: "/trades/:id/edit", element: <TradeFormPage /> },
          { path: "/chat", element: <ChatPage /> },
          { path: "/analytics", element: <AnalyticsPage /> },
          { path: "/portfolio", element: <PortfolioPage /> },
          { path: "/catalog", element: <CatalogPage /> },
          { path: "/notifications", element: <NotificationListPage /> },
          { path: "/daily-brief", element: <DailyBriefPage /> },
          { path: "/journal-insights", element: <JournalInsightsPage /> },
          { path: "/psychology", element: <PsychologyPage /> },
          { path: "/settings", element: <SettingsPage /> },
          { path: "/import", element: <CsvImportPage /> },
        ],
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      { path: "/calculator", element: <CalculatorPage /> },
      { path: "/calculator/:calculatorId", element: <CalculatorDetailPage /> },
    ],
  },
  {
    element: <DemoLayout />,
    children: [
      { path: "/demo/dashboard", element: <DashboardPage /> },
      { path: "/demo/analytics", element: <AnalyticsPage /> },
      { path: "/demo/trades", element: <TradeListPage /> },
    ],
  },
  { path: "/", element: <RootRedirect /> },
  { path: "*", element: <RootRedirect /> },
]);
