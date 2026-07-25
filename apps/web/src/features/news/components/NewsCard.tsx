import { ExternalLink, Newspaper } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartSkeleton } from "@/components/common/LoadingSkeletons";
import { formatDate } from "@/lib/utils";
import { useNews } from "../hooks";

function sentimentVariant(sentiment: string): "success" | "destructive" | "secondary" {
  const s = sentiment.toLowerCase();
  if (s.includes("positive") || s.includes("bullish")) return "success";
  if (s.includes("negative") || s.includes("bearish")) return "destructive";
  return "secondary";
}

export function NewsCard() {
  const { data, isLoading, error } = useNews();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="size-4" />
            News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="size-4" />
          News for your symbols
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{data.overallNote}</p>
        ) : (
          <>
            <Accordion>
              {data.items.map((item) => (
                <AccordionItem key={item.symbol} value={item.symbol}>
                  <AccordionTrigger>
                    <span className="flex flex-1 items-center gap-2">
                      <span className="font-medium">{item.symbol}</span>
                      <Badge variant={sentimentVariant(item.sentiment)}>{item.sentiment}</Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-2 pb-2">
                      <p className="text-sm text-muted-foreground">{item.summary}</p>
                      <p className="text-xs text-muted-foreground">{item.relevanceToTrader}</p>
                      {item.highlights.length > 0 && (
                        <ul className="mt-1 flex flex-col gap-1.5">
                          {item.highlights.map((h, i) => (
                            <li key={i} className="text-xs">
                              <a
                                href={h.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-primary hover:underline"
                              >
                                {h.title}
                                <ExternalLink className="size-3" />
                              </a>
                              <span className="text-muted-foreground">
                                {" "}
                                — {h.source} · {formatDate(h.publishedAt)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {data.overallNote && (
              <p className="mt-3 text-xs text-muted-foreground">{data.overallNote}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
