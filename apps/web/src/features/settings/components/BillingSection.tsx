import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import {
  useCancelSubscription,
  useSubscribe,
  useSubscriptionStatus,
  useVerifySubscription,
} from "@/features/subscription/hooks";

const CHECKOUT_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${CHECKOUT_SCRIPT_SRC}"]`,
  );
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay checkout")));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CHECKOUT_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
    document.body.appendChild(script);
  });
}

export function BillingSection() {
  const { data, isLoading } = useSubscriptionStatus();
  const subscribe = useSubscribe();
  const verify = useVerifySubscription();
  const cancel = useCancelSubscription();
  const user = useAuthStore((s) => s.user);

  const handleUpgrade = () => {
    subscribe.mutate(undefined, {
      onSuccess: async (result) => {
        await loadRazorpayScript();

        const razorpay = new window.Razorpay!({
          key: result.keyId,
          subscription_id: result.subscriptionId,
          name: "TradeMind AI",
          description: "Premium subscription",
          handler: (response) => {
            verify.mutate({
              paymentId: response.razorpay_payment_id,
              subscriptionId: response.razorpay_subscription_id,
              signature: response.razorpay_signature,
            });
          },
          prefill: {
            name: user ? `${user.firstName} ${user.lastName ?? ""}`.trim() : undefined,
            email: user?.email,
          },
          theme: {
            color: "#0f172a",
          },
        });

        razorpay.open();
      },
    });
  };

  return (
    <Card id="billing">
      <CardHeader>
        <CardTitle>Subscription &amp; billing</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLoading ? (
          <Skeleton className="h-16 w-full rounded-lg" />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-eyebrow">Current plan</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-semibold">
                  {data?.plan === "PREMIUM" ? "Premium" : "Free"}
                </span>
                {data?.plan === "PREMIUM" && <span className="text-sm text-muted-foreground">₹499/mo</span>}
                <Badge variant={data?.plan === "PREMIUM" ? "default" : "secondary"}>
                  {data?.subscription?.status ?? "—"}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-eyebrow">Next billing date</p>
              <p className="mt-1 font-medium">
                {data?.subscription?.currentPeriodEnd
                  ? formatDate(data.subscription.currentPeriodEnd)
                  : "—"}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {data?.plan !== "PREMIUM" ? (
            <Button
              disabled={subscribe.isPending || verify.isPending}
              onClick={handleUpgrade}
            >
              {subscribe.isPending
                ? "Preparing checkout…"
                : verify.isPending
                  ? "Verifying payment…"
                  : "Upgrade to Premium"}
            </Button>
          ) : (
            <Button
              variant="outline"
              className="text-destructive"
              disabled={cancel.isPending}
              onClick={() => cancel.mutate()}
            >
              {cancel.isPending ? "Cancelling…" : "Cancel plan"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
