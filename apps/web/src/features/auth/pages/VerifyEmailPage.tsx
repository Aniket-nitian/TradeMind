import { Link, useSearchParams } from "react-router-dom";
import { CircleAlert, Loader2, MailCheck } from "lucide-react";

import { normalizeError } from "@/lib/api/normalize-error";
import { useAuthStore } from "@/store/auth-store";
import { useVerifyEmail } from "../hooks";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const verifyEmail = useVerifyEmail(token);
  const isAuthenticated = useAuthStore((s) => s.status === "authenticated");

  const continueTo = isAuthenticated ? "/dashboard" : "/login";
  const continueLabel = isAuthenticated ? "Go to dashboard" : "Go to login";

  if (!token) {
    return (
      <StatusScreen
        icon={<CircleAlert className="size-5" />}
        tone="destructive"
        title="Link is invalid"
        description="This verification link is missing or malformed."
        linkTo={continueTo}
        linkLabel={continueLabel}
      />
    );
  }

  if (verifyEmail.isPending) {
    return (
      <StatusScreen
        icon={<Loader2 className="size-5 animate-spin" />}
        tone="primary"
        title="Verifying your email…"
        description="This will just take a moment."
      />
    );
  }

  if (verifyEmail.isError) {
    return (
      <StatusScreen
        icon={<CircleAlert className="size-5" />}
        tone="destructive"
        title="Couldn't verify your email"
        description={normalizeError(verifyEmail.error)}
        linkTo={continueTo}
        linkLabel={continueLabel}
      />
    );
  }

  return (
    <StatusScreen
      icon={<MailCheck className="size-5" />}
      tone="primary"
      title="Email verified"
      description="Your email address has been confirmed."
      linkTo={continueTo}
      linkLabel={continueLabel}
    />
  );
}

function StatusScreen({
  icon,
  tone,
  title,
  description,
  linkTo,
  linkLabel,
}: {
  icon: React.ReactNode;
  tone: "primary" | "destructive";
  title: string;
  description: string;
  linkTo?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div
        className={
          tone === "primary"
            ? "flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
            : "flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive"
        }
      >
        {icon}
      </div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      </div>
      {linkTo && linkLabel && (
        <Link
          to={linkTo}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
