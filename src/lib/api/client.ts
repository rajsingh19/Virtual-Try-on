// API base URL from environment variable or default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://vizzle-backend-vvc6.onrender.com';

// Simple API client using native fetch
export const apiClient = {
  baseUrl: API_BASE_URL,

  async GET<T = any>(endpoint: string, options?: {
    params?: { path?: Record<string, string>; query?: Record<string, string> }
  }): Promise<{ data?: T; error?: any }> {
    try {
      // Replace path params
      let url = endpoint;
      if (options?.params?.path) {
        Object.entries(options.params.path).forEach(([key, value]) => {
          url = url.replace(`{${key}}`, value);
        });
      }

      // Add query params
      if (options?.params?.query) {
        const queryString = new URLSearchParams(options.params.query).toString();
        url += `?${queryString}`;
      }

      // Add cache-busting for GET requests if no query params exist
      const separator = url.includes('?') ? '&' : '?';
      const cacheBuster = `${separator}_t=${Date.now()}`;
      const finalUrl = `${API_BASE_URL}${url}${cacheBuster}`;

      const response = await fetch(finalUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Request failed' }));
        return { error };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error };
    }
  },

  async POST<T = any>(endpoint: string, options?: {
    body?: any
  }): Promise<{ data?: T; error?: any }> {
    try {
      // Add cache-busting query parameter for POST requests
      const separator = endpoint.includes('?') ? '&' : '?';
      const cacheBuster = `${separator}_t=${Date.now()}`;
      const finalUrl = `${API_BASE_URL}${endpoint}${cacheBuster}`;

      const response = await fetch(finalUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
        cache: 'no-store',
        body: options?.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Request failed' }));
        return { error };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error };
    }
  },
};

// Helper function to handle API errors
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null) {
    // Handle API error responses
    if ('detail' in error) {
      return String(error.detail);
    }
    if ('message' in error) {
      return String(error.message);
    }
  }
  return 'An unexpected error occurred';
}

export default apiClient;
