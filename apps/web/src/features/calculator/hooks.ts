import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { normalizeError } from "@/lib/api/normalize-error";
import { calculatorApi } from "./api";

export function usePositionSizeCalculator() {
  return useMutation({
    mutationFn: calculatorApi.positionSize,
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useRiskRewardCalculator() {
  return useMutation({
    mutationFn: calculatorApi.riskReward,
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useStockAverageCalculator() {
  return useMutation({
    mutationFn: calculatorApi.stockAverage,
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useBrokerageCalculator() {
  return useMutation({
    mutationFn: calculatorApi.brokerage,
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useMarginCalculator() {
  return useMutation({
    mutationFn: calculatorApi.margin,
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function usePivotPointCalculator() {
  return useMutation({
    mutationFn: calculatorApi.pivotPoint,
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useFibonacciCalculator() {
  return useMutation({
    mutationFn: calculatorApi.fibonacci,
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useCagrCalculator() {
  return useMutation({
    mutationFn: calculatorApi.cagr,
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useLumpsumCalculator() {
  return useMutation({
    mutationFn: calculatorApi.lumpsum,
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useSipCalculator() {
  return useMutation({
    mutationFn: calculatorApi.sip,
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useGoalCalculator() {
  return useMutation({
    mutationFn: calculatorApi.goal,
    onError: (error) => toast.error(normalizeError(error)),
  });
}
