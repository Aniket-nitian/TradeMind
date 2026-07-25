import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useGoogleLogin } from "../hooks";

export function GoogleAuthButton() {
  const navigate = useNavigate();
  const googleLogin = useGoogleLogin();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or continue with</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="flex justify-center [&>div]:w-full">
        <GoogleLogin
          size="large"
          shape="pill"
          width="384"
          onSuccess={(credentialResponse) => {
            if (!credentialResponse.credential) {
              toast.error("Google didn't return a credential. Try again.");
              return;
            }

            googleLogin.mutate(credentialResponse.credential, {
              onSuccess: () => navigate("/dashboard"),
            });
          }}
          onError={() => toast.error("Google sign-in failed.")}
        />
      </div>
    </div>
  );
}
