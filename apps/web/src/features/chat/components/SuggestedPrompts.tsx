import { Badge } from "@/components/ui/badge";

const PROMPTS = [
  "How is my win rate trending?",
  "Review my last trade",
  "What's my biggest recurring mistake?",
  "Which strategy is working best for me?",
];

export function SuggestedPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PROMPTS.map((prompt) => (
        <Badge
          key={prompt}
          variant="outline"
          className="cursor-pointer py-1.5"
          onClick={() => onSelect(prompt)}
        >
          {prompt}
        </Badge>
      ))}
    </div>
  );
}
