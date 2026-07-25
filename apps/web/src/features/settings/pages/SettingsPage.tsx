import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/ErrorState";
import { CardGridSkeleton } from "@/components/common/LoadingSkeletons";
import { useSettings } from "../hooks";
import { ProfileSection } from "../components/ProfileSection";
import { TradingPreferencesSection } from "../components/TradingPreferencesSection";
import { NotificationsSection } from "../components/NotificationsSection";
import { SessionsSection } from "../components/SessionsSection";
import { BrokerSection } from "../components/BrokerSection";
import { SyncHistorySection } from "@/features/broker/components/SyncHistorySection";
import { BillingSection } from "../components/BillingSection";
import { PaymentHistorySection } from "@/features/subscription/components/PaymentHistorySection";
import { MemorySection } from "@/features/memory/components/MemorySection";
import { DangerZoneSection } from "../components/DangerZoneSection";

export default function SettingsPage() {
  const { data, isLoading, error } = useSettings();
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash || !data) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash, data]);

  return (
    <div>
      <PageHeader title="Settings" description="Manage your account, broker, and billing." />

      {isLoading && <CardGridSkeleton count={4} />}
      {error && <ErrorState error={error} />}

      {data && (
        <div className="flex flex-col gap-6">
          <ProfileSection profile={data.profile} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <TradingPreferencesSection profile={data.profile} />
            <NotificationsSection profile={data.profile} />
          </div>

          <BrokerSection profile={data.profile} />
          <SyncHistorySection />

          <SessionsSection />

          <BillingSection />
          <PaymentHistorySection />

          <MemorySection />

          <DangerZoneSection />
        </div>
      )}
    </div>
  );
}
