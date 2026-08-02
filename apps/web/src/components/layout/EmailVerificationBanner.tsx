import { MailWarning } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useProfile, useResendVerification } from "@/features/auth/hooks";

export function EmailVerificationBanner() {
  const { data: profile } = useProfile();
  const resend = useResendVerification();

  if (!profile || profile.isEmailVerified) return null;

  return (
    <div className="flex items-center justify-between gap-3 border-b border-warning/30 bg-warning/10 px-6 py-2 text-sm">
      <div className="flex items-center gap-2 text-warning-foreground">
        <MailWarning className="size-4 shrink-0 text-warning" />
        <span>
          Verify your email to secure your account and receive alerts —{" "}
          <span className="font-medium">{profile.email}</span> is unverified.
        </span>
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={resend.isPending}
        onClick={() => resend.mutate()}
        className="shrink-0"
      >
        {resend.isPending ? "Sending…" : "Resend email"}
      </Button>
    </div>
  );
}
