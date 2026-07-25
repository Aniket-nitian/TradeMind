import { useRef, useState } from "react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CSV_BROKERS } from "../types";

interface UploadStepProps {
  onUpload: (file: File, broker?: string) => void;
  isUploading: boolean;
}

export function UploadStep({ onUpload, isUploading }: UploadStepProps) {
  const [broker, setBroker] = useState<string | undefined>();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    onUpload(file, broker);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-eyebrow mb-1.5">Broker (optional)</p>
        <Select value={broker} onValueChange={(v) => setBroker(v ?? undefined)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Generic / Other" />
          </SelectTrigger>
          <SelectContent>
            {CSV_BROKERS.map((b) => (
              <SelectItem key={b.value} value={b.value}>
                {b.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {broker === "DHAN" && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Dhan's Realised P&amp;L report doesn't include exact trade dates — imported
            trades will use the report's end date as a placeholder. You'll need to edit
            each one with the real date afterward.
          </p>
        )}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        className={cn(
          "flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border"
        )}
      >
        <div className="flex size-10 items-center justify-center rounded-full bg-accent">
          <Upload className="size-5" />
        </div>
        <div>
          <p className="font-medium">Drag and drop your CSV or Excel file here</p>
          <p className="text-sm text-muted-foreground">Or click to browse from your computer</p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? "Uploading…" : "Choose file"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
