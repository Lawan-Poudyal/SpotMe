export interface ErrorResponse {
  status: number;
  message: string;
  stack?: string;
  errors?: Record<string, string> | undefined; // for validation errors
}
