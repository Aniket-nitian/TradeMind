export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: unknown;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Paginated<T> {
  trades: T[];
  pagination: Pagination;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  errors?: unknown;
}
