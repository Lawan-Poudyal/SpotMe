export interface ErrorResponse {
  status: number;
  message: string;
  stack?: string;
  errors?: string[]; // for validation errors
}
