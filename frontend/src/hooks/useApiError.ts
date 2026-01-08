import { AxiosError } from 'axios';
import { useCallback } from 'react';

interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * Centralized API error handling
 * Provides consistent error parsing and user-friendly messages
 */
export function useApiError() {
  const parseError = useCallback((error: unknown): ApiError => {
    if (error instanceof AxiosError) {
      const data = error.response?.data;
      
      return {
        message: data?.message || error.message || 'An unexpected error occurred',
        statusCode: error.response?.status,
        errors: data?.errors,
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message,
      };
    }

    return {
      message: 'An unexpected error occurred',
    };
  }, []);

  const getErrorMessage = useCallback((error: unknown): string => {
    const parsed = parseError(error);
    return parsed.message;
  }, [parseError]);

  const getFieldErrors = useCallback((error: unknown): Record<string, string[]> => {
    const parsed = parseError(error);
    return parsed.errors || {};
  }, [parseError]);

  const isAuthError = useCallback((error: unknown): boolean => {
    const parsed = parseError(error);
    return parsed.statusCode === 401 || parsed.statusCode === 403;
  }, [parseError]);

  const isValidationError = useCallback((error: unknown): boolean => {
    const parsed = parseError(error);
    return parsed.statusCode === 400 && !!parsed.errors;
  }, [parseError]);

  return {
    parseError,
    getErrorMessage,
    getFieldErrors,
    isAuthError,
    isValidationError,
  };
}
