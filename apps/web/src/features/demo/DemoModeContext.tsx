import { createContext, useContext, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DemoGate {
  isDemo: boolean;
  requireAuth: () => boolean;
}

const DemoModeContext = createContext<DemoGate>({
  isDemo: false,
  requireAuth: () => true,
});

export function useDemoGate() {
  return useContext(DemoModeContext);
}

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const gate: DemoGate = {
    isDemo: true,
    requireAuth: () => {
      setOpen(true);
      return false;
    },
  };

  return (
    <DemoModeContext.Provider value={gate}>
      {children}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Lock className="size-5" />
            </div>
            <DialogTitle className="text-lg">Sign up to continue</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            You&apos;re browsing a live sample of TradeMind AI. Create a free account to log
            real trades, import your history, and unlock AI-powered insights on your own data.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => navigate("/login")}>
              Log in
            </Button>
            <Button onClick={() => navigate("/register")}>
              <UserPlus className="size-4" />
              Create free account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DemoModeContext.Provider>
  );
}
