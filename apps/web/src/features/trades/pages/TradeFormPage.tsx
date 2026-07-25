import { useParams, useNavigate } from "react-router-dom";

import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrade } from "../hooks";
import { TradeForm } from "../components/TradeForm";
import { TradeWizard } from "../components/wizard/TradeWizard";

export default function TradeFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: trade, isLoading, error } = useTrade(id ?? "");

  if (!isEdit) {
    return <TradeWizard onClose={() => navigate("/trades")} />;
  }

  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-lg" />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div>
      <PageHeader title="Edit trade" />
      <TradeForm trade={trade} />
    </div>
  );
}
