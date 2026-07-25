export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;

  tradingExperience?:
    | "BEGINNER"
    | "INTERMEDIATE"
    | "ADVANCED"
    | "PROFESSIONAL";

  riskProfile?:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

  preferredBroker?: string;

  tradingStyle?:
    | "INTRADAY"
    | "SWING"
    | "POSITIONAL"
    | "SCALPING"
    | "INVESTOR";

  timezone?: string;
  currency?: string;
}