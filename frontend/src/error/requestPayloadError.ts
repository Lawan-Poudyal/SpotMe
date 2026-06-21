import type { ApiFailurePayload } from "../types/apiFailurePayloadType";
export class ApiError extends Error {
  payload?: ApiFailurePayload;

  constructor(message: string, options?: { payload?: ApiFailurePayload }) {
    super(message);
    this.name = 'ApiError';
    this.payload = options?.payload;
  }
}
