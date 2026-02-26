import { useState, useCallback } from 'react';

interface ExecuteOptions {
  body?: any;
  dynamicEndpoint?: string;
}

export const useFetch = (method: 'GET' | 'POST' | 'PATCH' | 'DELETE', endpoint: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_API_URL;

  const execute = useCallback(async (options?: ExecuteOptions) => {
    setIsLoading(true);
    setError(null);
    setStatus(null);

    const finalEndpoint = options?.dynamicEndpoint ? `${endpoint}${options.dynamicEndpoint}` : endpoint;

    try {
      const response = await fetch(`${baseUrl}${finalEndpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: options?.body ? JSON.stringify(options.body) : undefined,
      });

      setStatus(response.status);

	  if (response.status === 401 && endpoint !== '/auth/check') {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }

      let responseData = null;
      try {
        responseData = await response.json();
      } catch (e) {
      }

      setData(responseData);

      if (!response.ok) {
        const errorMessage = responseData?.message || 'Une erreur est survenue';
        setError(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
        
        return { success: false, data: responseData, status: response.status };
      }

      return { success: true, data: responseData, status: response.status };

    } catch (err: any) {
      setError('Erreur réseau ou serveur inaccessible.');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [method, endpoint, baseUrl]);

  return { execute, isLoading, status, data, error };
};