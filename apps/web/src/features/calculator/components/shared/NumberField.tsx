import type { UseFormRegisterReturn } from "react-hook-form";

import { Field, FieldError as FieldErrorMessage, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NumberFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: { message?: string };
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}

export function NumberField({
  label,
  registration,
  error,
  prefix,
  suffix,
  placeholder,
}: NumberFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={registration.name}>{label}</FieldLabel>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          id={registration.name}
          type="number"
          inputMode="decimal"
          step="any"
          placeholder={placeholder}
          aria-invalid={!!error}
          className={cn(prefix && "pl-6", suffix && "pr-7")}
          {...registration}
        />
        {suffix && (
          <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      <FieldErrorMessage errors={[error]} />
    </Field>
  );
}
