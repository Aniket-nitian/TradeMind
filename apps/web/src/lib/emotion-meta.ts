import type { Emotion } from "./constants";

export type EmotionTone = "success" | "destructive" | "warning" | "muted" | "primary";

export const EMOTION_META: Record<
  Emotion,
  { emoji: string; label: string; tone: EmotionTone }
> = {
  CONFIDENT: { emoji: "😎", label: "Confident", tone: "success" },
  DISCIPLINED: { emoji: "🧭", label: "Disciplined", tone: "success" },
  FOCUSED: { emoji: "🎯", label: "Focused", tone: "success" },
  CALM: { emoji: "😌", label: "Calm", tone: "primary" },
  FEAR: { emoji: "😨", label: "Fear", tone: "destructive" },
  ANXIOUS: { emoji: "😰", label: "Anxious", tone: "destructive" },
  REVENGE: { emoji: "😤", label: "Revenge", tone: "destructive" },
  GREED: { emoji: "🤑", label: "Greed", tone: "warning" },
  FOMO: { emoji: "😵", label: "FOMO", tone: "warning" },
  HESITATION: { emoji: "🤔", label: "Hesitation", tone: "warning" },
  BORED: { emoji: "😑", label: "Bored", tone: "muted" },
};
