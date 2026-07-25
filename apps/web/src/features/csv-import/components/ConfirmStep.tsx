import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatTile } from "@/features/dashboard/components/StatTile";
import type { CsvConfirmResult, CsvPreviewResult } from "../types";

interface ConfirmStepProps {
  preview: CsvPreviewResult;
  result: CsvConfirmResult | null;
  onConfirm: () => void;
  isConfirming: boolean;
}

function resultHeadline(result: CsvConfirmResult) {
  if (result.importedRows === 0 && result.skippedDuplicates > 0) {
    return "Already up to date — nothing new to import";
  }

  return `Import ${result.status.toLowerCase()}`;
}

export function ConfirmStep({ preview, result, onConfirm, isConfirming }: ConfirmStepProps) {
  if (result) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="size-10 text-success" />
        <p className="text-lg font-semibold">{resultHeadline(result)}</p>
        <div className="grid grid-cols-3 gap-4">
          <StatTile label="Imported" value={String(result.importedRows)} />
          <StatTile label="Skipped (duplicate)" value={String(result.skippedDuplicates)} />
          <StatTile label="Skipped (invalid)" value={String(result.skippedInvalid)} />
        </div>
      </div>
    );
  }

  if (preview.readyToImport === 0) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Every row in this file is already in your journal — there's nothing new to import.
          Click below to close out this import.
        </p>
        <Button disabled={isConfirming} onClick={onConfirm} className="self-start">
          {isConfirming ? "Finishing…" : "Finish"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        By clicking confirm, {preview.readyToImport} ready trade(s) will be added to your
        journal. This action can be undone from your trade list afterward if needed.
      </p>
      <Button disabled={isConfirming} onClick={onConfirm} className="self-start">
        {isConfirming ? "Importing…" : `Confirm import (${preview.readyToImport})`}
      </Button>
    </div>
  );
}
