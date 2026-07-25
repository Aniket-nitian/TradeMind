import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCTS, SEGMENTS, SIDES } from "@/lib/constants";
import { useStrategies } from "@/features/strategies/hooks";
import { useCreateTrade, useUpdateTrade } from "../hooks";
import type { Trade } from "../types";

const schema = z.object({
  symbol: z.string().min(1, "Symbol is required.").toUpperCase(),
  segment: z.enum(SEGMENTS),
  product: z.enum(PRODUCTS),
  side: z.enum(SIDES),
  quantity: z.coerce.number().positive("Quantity must be positive."),
  entryPrice: z.coerce.number().positive("Entry price must be positive."),
  exitPrice: z.coerce.number().positive().optional().or(z.literal("")),
  stopLoss: z.coerce.number().positive().optional().or(z.literal("")),
  target: z.coerce.number().positive().optional().or(z.literal("")),
  confidence: z.coerce.number().min(1).max(10).optional().or(z.literal("")),
  strategyId: z.string().optional(),
  entryTime: z.string().min(1, "Entry time is required."),
  exitTime: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function toDatetimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function TradeForm({ trade }: { trade?: Trade }) {
  const navigate = useNavigate();
  const { data: strategies } = useStrategies();

  const createTrade = useCreateTrade();
  const updateTrade = useUpdateTrade(trade?.id ?? "");

  const isEdit = !!trade;
  const mutation = isEdit ? updateTrade : createTrade;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.input<typeof schema>, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: trade
      ? {
          symbol: trade.symbol,
          segment: trade.segment,
          product: trade.product,
          side: trade.side,
          quantity: trade.quantity,
          entryPrice: trade.entryPrice,
          exitPrice: trade.exitPrice ?? "",
          stopLoss: trade.stopLoss ?? "",
          target: trade.target ?? "",
          confidence: trade.confidence ?? "",
          strategyId: trade.strategyId ?? undefined,
          entryTime: toDatetimeLocal(trade.entryTime),
          exitTime: toDatetimeLocal(trade.exitTime),
        }
      : { segment: "EQUITY", product: "MIS", side: "BUY" },
  });

  const onSubmit = handleSubmit((values) => {
    const payload = {
      ...values,
      exitPrice: values.exitPrice === "" ? undefined : Number(values.exitPrice),
      stopLoss: values.stopLoss === "" ? undefined : Number(values.stopLoss),
      target: values.target === "" ? undefined : Number(values.target),
      confidence:
        values.confidence === "" ? undefined : Number(values.confidence),
      entryTime: new Date(values.entryTime).toISOString(),
      exitTime: values.exitTime
        ? new Date(values.exitTime).toISOString()
        : undefined,
    };

    mutation.mutate(payload, {
      onSuccess: (result) => navigate(`/trades/${result.id}`),
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6"
    >
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="symbol">Symbol</FieldLabel>
            <Input id="symbol" placeholder="RELIANCE" {...register("symbol")} />
            <FieldError errors={[errors.symbol]} />
          </Field>

          <Field>
            <FieldLabel>Strategy</FieldLabel>
            <Controller
              control={control}
              name="strategyId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    {strategies?.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel>Segment</FieldLabel>
            <Controller
              control={control}
              name="segment"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
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
                  <SelectTrigger className="w-full">
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

          <Field>
            <FieldLabel>Side</FieldLabel>
            <Controller
              control={control}
              name="side"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
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

        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
            <Input id="quantity" type="number" step="any" {...register("quantity")} />
            <FieldError errors={[errors.quantity]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="entryPrice">Entry price</FieldLabel>
            <Input id="entryPrice" type="number" step="any" {...register("entryPrice")} />
            <FieldError errors={[errors.entryPrice]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="exitPrice">Exit price</FieldLabel>
            <Input id="exitPrice" type="number" step="any" {...register("exitPrice")} />
            <FieldError errors={[errors.exitPrice]} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel htmlFor="stopLoss">Stop loss</FieldLabel>
            <Input id="stopLoss" type="number" step="any" {...register("stopLoss")} />
          </Field>

          <Field>
            <FieldLabel htmlFor="target">Target</FieldLabel>
            <Input id="target" type="number" step="any" {...register("target")} />
          </Field>

          <Field>
            <FieldLabel htmlFor="confidence">Confidence (1-10)</FieldLabel>
            <Input id="confidence" type="number" min={1} max={10} {...register("confidence")} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="entryTime">Entry time</FieldLabel>
            <Input id="entryTime" type="datetime-local" {...register("entryTime")} />
            <FieldError errors={[errors.entryTime]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="exitTime">Exit time</FieldLabel>
            <Input id="exitTime" type="datetime-local" {...register("exitTime")} />
          </Field>
        </div>
      </FieldGroup>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? "Saving…"
            : isEdit
              ? "Save changes"
              : "Create trade"}
        </Button>
      </div>
    </form>
  );
}
