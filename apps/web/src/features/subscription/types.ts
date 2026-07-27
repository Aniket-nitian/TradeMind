export type SubscriptionStatus =
  | "INCOMPLETE"
  | "ACTIVE"
  | "CANCELED"
  | "PAST_DUE"
  | "PAUSED";

export interface SubscriptionDetails {
  id: string;
  userId: string;
  plan: "FREE" | "PREMIUM";
  status: SubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  providerSubscriptionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionStatusResponse {
  plan: "FREE" | "PREMIUM";
  subscription: SubscriptionDetails | null;
  isTestMode: boolean;
}

export interface SubscribeResponse {
  subscriptionId: string;
  keyId: string;
  shortUrl: string;
  status: string;
}

export interface VerifySubscriptionPayload {
  paymentId: string;
  subscriptionId: string;
  signature: string;
}

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export interface Payment {
  id: string;
  providerPaymentId: string;
  providerOrderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface PaymentHistoryResult {
  payments: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}
