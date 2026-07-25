import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ListChecks,
  NotebookPen,
  ShieldAlert,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Stepper } from "@/components/common/Stepper";
import { useCreateTrade } from "../../hooks";
import { useAttachMistakes } from "@/features/mistakes/hooks";
import { Step1TradeInfo } from "./Step1TradeInfo";
import { Step2RiskStrategy } from "./Step2RiskStrategy";
import { Step3Reflection } from "./Step3Reflection";
import { Step4Review } from "./Step4Review";
import {
  STEP_FIELDS,
  WIZARD_STEPS,
  wizardSchema,
  type WizardFormInput,
  type WizardFormValues,
} from "./schema";

const STEP_META = [
  { icon: ClipboardList, title: "Trade information" },
  { icon: ShieldAlert, title: "Risk & strategy" },
  { icon: NotebookPen, title: "Mindset & reflection" },
  { icon: ListChecks, title: "Review & confirm" },
] as const;

export function TradeWizard({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [mistakeIds, setMistakeIds] = useState<string[]>([]);

  const createTrade = useCreateTrade();
  const attachMistakes = useAttachMistakes();

  const form = useForm<WizardFormInput, unknown, WizardFormValues>({
    resolver: zodResolver(wizardSchema),
    defaultValues: { segment: "EQUITY", product: "MIS", side: "BUY", confidence: 5 },
  });

  const toggleMistake = (id: string) =>
    setMistakeIds((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));

  const handleNext = async () => {
    const fields = STEP_FIELDS[step];
    const isValid = await form.trigger(fields as (keyof WizardFormInput)[]);
    if (!isValid) return;
    setStep((s) => Math.min(s + 1, WIZARD_STEPS.length - 1));
  };

  const handleSubmit = form.handleSubmit((values) => {
    const payload = {
      symbol: values.symbol,
      segment: values.segment,
      product: values.product,
      side: values.side,
      quantity: values.quantity,
      entryPrice: values.entryPrice,
      exitPrice: values.exitPrice === "" ? undefined : Number(values.exitPrice),
      stopLoss: values.stopLoss === "" ? undefined : Number(values.stopLoss),
      target: values.target === "" ? undefined : Number(values.target),
      confidence: values.confidence,
      strategyId: values.strategyId,
      entryTime: new Date(values.entryTime).toISOString(),
      exitTime: values.exitTime ? new Date(values.exitTime).toISOString() : undefined,
      reasonForEntry: values.reasonForEntry || undefined,
      reasonForExit: values.reasonForExit || undefined,
      tradeNotes: values.tradeNotes || undefined,
      lessonLearned: values.lessonLearned || undefined,
      emotionBefore: values.emotionBefore,
    };

    createTrade.mutate(payload, {
      onSuccess: (trade) => {
        if (mistakeIds.length > 0) {
          attachMistakes.mutate({ tradeId: trade.id, mistakeIds });
        }
        onClose();
        navigate(`/trades/${trade.id}`);
      },
    });
  });

  const StepIcon = STEP_META[step].icon;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[88vh] max-w-3xl flex-col overflow-hidden p-0"
      >
        <DialogHeader className="gap-4 border-b border-border px-6 pt-6 pb-5">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Journal new trade</DialogTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="size-4" />
            </Button>
          </div>
          <Stepper steps={WIZARD_STEPS} currentStep={step} />
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <StepIcon className="size-4" />
            </div>
            <h3 className="text-base font-semibold">{STEP_META[step].title}</h3>
          </div>

          {step === 0 && <Step1TradeInfo form={form} />}
          {step === 1 && <Step2RiskStrategy form={form} />}
          {step === 2 && (
            <Step3Reflection
              form={form}
              selectedMistakeIds={mistakeIds}
              onToggleMistake={toggleMistake}
            />
          )}
          {step === 3 && <Step4Review form={form} mistakeIds={mistakeIds} />}
        </div>

        <div className="flex justify-between border-t border-border bg-muted/30 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl px-4"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>

          {step < WIZARD_STEPS.length - 1 ? (
            <Button type="button" className="h-10 rounded-xl px-4" onClick={handleNext}>
              Next step
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              className="h-10 rounded-xl px-4"
              onClick={handleSubmit}
              disabled={createTrade.isPending}
            >
              {createTrade.isPending ? "Creating…" : "Create trade"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
