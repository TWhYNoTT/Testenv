// src/types/api-errors.ts
export type ErrorCode = 400 | 401 | 403 | 404 | 500;

export interface ErrorResponse {
    message: string;
    errors?: Record<string, string[]>;
    statusCode: ErrorCode;
} 