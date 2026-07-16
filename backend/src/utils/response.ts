export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  error: ApiError | null;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Array<{ field: string; message: string }> | unknown;
}

export function successResponse<T>(
  data: T,
  message = 'Success',
  meta?: Record<string, unknown>
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    error: null,
    ...(meta ? { meta } : {}),
  };
}

export function errorResponse(error: ApiError, message = 'Error'): ApiResponse<null> {
  return {
    success: false,
    data: null,
    message,
    error,
  };
}
