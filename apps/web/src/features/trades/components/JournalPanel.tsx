import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Field, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { useTradeJournal, useUpdateJournal } from "../hooks";

export function JournalPanel({ tradeId }: { tradeId: string }) {
  const { data: journal, isLoading } = useTradeJournal(tradeId);
  const updateJournal = useUpdateJournal(tradeId);

  const [form, setForm] = useState({
    reasonForEntry: "",
    reasonForExit: "",
    tradeNotes: "",
    lessonLearned: "",
    followedPlan: false,
  });

  useEffect(() => {
    if (journal) {
      setForm({
        reasonForEntry: journal.reasonForEntry ?? "",
        reasonForExit: journal.reasonForExit ?? "",
        tradeNotes: journal.tradeNotes ?? "",
        lessonLearned: journal.lessonLearned ?? "",
        followedPlan: journal.followedPlan ?? false,
      });
    }
  }, [journal]);

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-lg" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Field>
        <FieldLabel>Reason for entry</FieldLabel>
        <Textarea
          value={form.reasonForEntry}
          onChange={(e) =>
            setForm((f) => ({ ...f, reasonForEntry: e.target.value }))
          }
        />
      </Field>

      <Field>
        <FieldLabel>Reason for exit</FieldLabel>
        <Textarea
          value={form.reasonForExit}
          onChange={(e) =>
            setForm((f) => ({ ...f, reasonForExit: e.target.value }))
          }
        />
      </Field>

      <Field>
        <FieldLabel>Trade notes</FieldLabel>
        <Textarea
          value={form.tradeNotes}
          onChange={(e) => setForm((f) => ({ ...f, tradeNotes: e.target.value }))}
        />
      </Field>

      <Field>
        <FieldLabel>Lesson learned</FieldLabel>
        <Textarea
          value={form.lessonLearned}
          onChange={(e) =>
            setForm((f) => ({ ...f, lessonLearned: e.target.value }))
          }
        />
      </Field>

      <Field orientation="horizontal">
        <Switch
          checked={form.followedPlan}
          onCheckedChange={(checked) =>
            setForm((f) => ({ ...f, followedPlan: checked }))
          }
        />
        <FieldLabel>Followed plan</FieldLabel>
      </Field>

      <div className="flex justify-end">
        <Button
          disabled={updateJournal.isPending}
          onClick={() => updateJournal.mutate(form)}
        >
          {updateJournal.isPending ? "Saving…" : "Save journal"}
        </Button>
      </div>
    </div>
  );
}
