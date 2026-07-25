import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { Stepper } from "@/components/common/Stepper";
import { useCsvConfirm, useCsvUpload } from "../hooks";
import { UploadStep } from "../components/UploadStep";
import { MappingPreviewStep } from "../components/MappingPreviewStep";
import { ConfirmStep } from "../components/ConfirmStep";
import type { CsvConfirmResult, CsvPreviewResult } from "../types";

const STEPS = ["Upload", "Mapping", "Confirm"];

export default function CsvImportPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState<CsvPreviewResult | null>(null);
  const [confirmResult, setConfirmResult] = useState<CsvConfirmResult | null>(null);

  const upload = useCsvUpload();
  const confirm = useCsvConfirm();

  return (
    <div>
      <PageHeader title="Import trades" description="Sync your trading history from a broker CSV." />

      <Card className="max-w-3xl">
        <CardContent className="flex flex-col gap-6">
          <Stepper steps={STEPS} currentStep={step} />

          {step === 0 && (
            <UploadStep
              isUploading={upload.isPending}
              onUpload={(file, broker) =>
                upload.mutate(
                  { file, broker },
                  {
                    onSuccess: (result) => {
                      setPreview(result);
                      setStep(1);
                    },
                  }
                )
              }
            />
          )}

          {step === 1 && preview && <MappingPreviewStep result={preview} />}

          {step === 2 && preview && (
            <ConfirmStep
              preview={preview}
              result={confirmResult}
              isConfirming={confirm.isPending}
              onConfirm={() =>
                confirm.mutate(preview.importId, {
                  onSuccess: (result) => setConfirmResult(result),
                })
              }
            />
          )}

          <div className="flex justify-between border-t border-border pt-4">
            <Button
              variant="outline"
              onClick={() => (step === 0 ? navigate("/trades") : setStep((s) => s - 1))}
              disabled={confirmResult !== null}
            >
              {step === 0 ? "Cancel" : "Back"}
            </Button>

            {step === 1 && (
              <Button onClick={() => setStep(2)} disabled={!preview}>
                Continue
              </Button>
            )}

            {step === 2 && confirmResult && (
              <Button onClick={() => navigate("/trades")}>Go to journal</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
