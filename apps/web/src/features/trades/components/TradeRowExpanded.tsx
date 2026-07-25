import { EmotionBadge } from "@/components/common/EmotionBadge";
import { MistakeTag } from "@/components/common/MistakeTag";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useTradeDetails } from "../hooks";

export function TradeRowExpanded({ tradeId }: { tradeId: string }) {
  const { data: details, isLoading } = useTradeDetails(tradeId);

  if (isLoading) {
    return <Skeleton className="h-32 w-full rounded-lg" />;
  }

  if (!details) return null;

  return (
    <div className="grid grid-cols-1 gap-6 rounded-lg border border-border bg-card/50 p-4 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        {details.reasonForEntry && (
          <div>
            <p className="text-eyebrow mb-1">Reason for entry</p>
            <p className="text-sm">{details.reasonForEntry}</p>
          </div>
        )}
        {details.reasonForExit && (
          <div>
            <p className="text-eyebrow mb-1">Reason for exit</p>
            <p className="text-sm">{details.reasonForExit}</p>
          </div>
        )}
        {details.tradeNotes && (
          <div>
            <p className="text-eyebrow mb-1">Trade notes</p>
            <p className="text-sm text-muted-foreground italic">
              &ldquo;{details.tradeNotes}&rdquo;
            </p>
          </div>
        )}
        {details.lessonLearned && (
          <div>
            <p className="text-eyebrow mb-1">Lesson learned</p>
            <p className="text-sm">{details.lessonLearned}</p>
          </div>
        )}
        {!details.reasonForEntry &&
          !details.reasonForExit &&
          !details.tradeNotes &&
          !details.lessonLearned && (
            <p className="text-sm text-muted-foreground">No journal notes yet.</p>
          )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {details.emotionBefore && <EmotionBadge emotion={details.emotionBefore} />}
          {details.emotionAfter && <EmotionBadge emotion={details.emotionAfter} />}
        </div>

        <div>
          <p className="text-eyebrow mb-1">Confidence</p>
          <div className="flex items-center gap-2">
            <Progress value={(details.confidence / 10) * 100} className="w-32" />
            <span className="text-sm text-muted-foreground">
              {details.confidence}/10
            </span>
          </div>
        </div>

        {details.mistakes.length > 0 && (
          <div>
            <p className="text-eyebrow mb-1">Mistakes tagged</p>
            <div className="flex flex-wrap gap-1.5">
              {details.mistakes.map((m) => (
                <MistakeTag key={m.id} name={m.name} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
