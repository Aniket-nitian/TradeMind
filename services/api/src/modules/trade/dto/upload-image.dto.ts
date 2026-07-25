export interface UploadTradeImageDto {
  tradeId: string;
  type?: "ENTRY" | "EXIT" | "SETUP" | "CHART" | "RESULT";
}