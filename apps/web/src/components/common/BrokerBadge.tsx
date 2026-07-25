import { Badge } from "@/components/ui/badge";
import { BROKER_LABELS, type Broker } from "@/features/broker/types";

export function BrokerBadge({ broker }: { broker: Broker | null }) {
  if (!broker) {
    return <Badge variant="secondary">Manual</Badge>;
  }

  return <Badge variant="outline">{BROKER_LABELS[broker]}</Badge>;
}
