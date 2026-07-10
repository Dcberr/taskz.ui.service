import axios from 'axios';

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data;

    if (payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string') {
      return payload.message;
    }

    if (typeof payload === 'string' && payload.trim() !== '') {
      return payload;
    }
  }

  return error instanceof Error ? error.message : fallback;
}
