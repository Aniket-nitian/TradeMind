import { Controller, type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCTS, SEGMENTS, SIDES } from "@/lib/constants";
import type { WizardFormInput } from "./schema";

export function Step1TradeInfo({ form }: { form: UseFormReturn<WizardFormInput> }) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <FieldGroup>
      <div className="grid grid-cols-2 gap-5">
        <Field>
          <FieldLabel htmlFor="symbol">Symbol</FieldLabel>
          <Input
            id="symbol"
            placeholder="RELIANCE"
            className="h-11 rounded-xl px-3.5"
            {...register("symbol")}
          />
          <FieldError errors={[errors.symbol]} />
        </Field>

        <Field>
          <FieldLabel>Side</FieldLabel>
          <Controller
            control={control}
            name="side"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="!h-11 w-full rounded-xl px-3.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SIDES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Field>
          <FieldLabel>Segment</FieldLabel>
          <Controller
            control={control}
            name="segment"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="!h-11 w-full rounded-xl px-3.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEGMENTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field>
          <FieldLabel>Product</FieldLabel>
          <Controller
            control={control}
            name="product"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="!h-11 w-full rounded-xl px-3.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCTS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <Field>
          <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
          <Input
            id="quantity"
            type="number"
            step="any"
            className="h-11 rounded-xl px-3.5"
            {...register("quantity")}
          />
          <FieldError errors={[errors.quantity]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="entryPrice">Entry price</FieldLabel>
          <Input
            id="entryPrice"
            type="number"
            step="any"
            className="h-11 rounded-xl px-3.5"
            {...register("entryPrice")}
          />
          <FieldError errors={[errors.entryPrice]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="exitPrice">Exit price</FieldLabel>
          <Input
            id="exitPrice"
            type="number"
            step="any"
            className="h-11 rounded-xl px-3.5"
            {...register("exitPrice")}
          />
          <FieldError errors={[errors.exitPrice]} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Field>
          <FieldLabel htmlFor="entryTime">Entry time</FieldLabel>
          <Input
            id="entryTime"
            type="datetime-local"
            className="h-11 rounded-xl px-3.5"
            {...register("entryTime")}
          />
          <FieldError errors={[errors.entryTime]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="exitTime">Exit time</FieldLabel>
          <Input
            id="exitTime"
            type="datetime-local"
            className="h-11 rounded-xl px-3.5"
            {...register("exitTime")}
          />
        </Field>
      </div>
    </FieldGroup>
  );
}
