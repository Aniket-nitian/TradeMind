import type { Broker } from "@/features/broker/types";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string | null;
  username: string | null;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  tradingExperience: string | null;
  riskProfile: string | null;
  preferredBroker: Broker | null;
  tradingStyle: string | null;
  timezone: string | null;
  currency: string | null;
  subscription: "FREE" | "PREMIUM";
  defaultAccountSize: number | null;
  defaultRiskPercent: number | null;
  brokerSyncLookbackDays: number | null;
  isEmailVerified: boolean;
  emailNotificationsEnabled: boolean;
  whatsappNotificationsEnabled: boolean;
  createdAt: string;
}

export interface SettingsResponse {
  profile: UserProfile;
  activeSessionCount: number;
}

export interface SessionInfo {
  id: string;
  deviceName: string | null;
  deviceType: string | null;
  browser: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  lastActiveAt: string;
  createdAt: string;
}
