import { Badge } from "@/components/ui/badge";

export function MistakeTag({ name }: { name: string }) {
  return <Badge variant="warning">{name}</Badge>;
}
