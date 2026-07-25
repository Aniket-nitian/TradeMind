import { Badge, type badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import { EMOTION_META, type EmotionTone } from "@/lib/emotion-meta";
import type { Emotion } from "@/lib/constants";

const TONE_TO_VARIANT: Record<
  EmotionTone,
  NonNullable<VariantProps<typeof badgeVariants>["variant"]>
> = {
  success: "success",
  destructive: "destructive",
  warning: "warning",
  primary: "default",
  muted: "secondary",
};

export function EmotionBadge({ emotion }: { emotion: Emotion }) {
  const meta = EMOTION_META[emotion];
  return (
    <Badge variant={TONE_TO_VARIANT[meta.tone]}>
      <span aria-hidden="true">{meta.emoji}</span>
      {meta.label}
    </Badge>
  );
}
