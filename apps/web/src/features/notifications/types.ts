export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  deletedAt: string | null;
}
