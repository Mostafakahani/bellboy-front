import { useState, useCallback, useRef, useEffect } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T[];
}

interface AuthenticatedFetchResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useAuthenticatedFetch() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleAuthError = useCallback(() => {
    if (!isRedirecting) {
      setIsRedirecting(true);
      deleteCookie("authToken");
      router.push("/login");
      setTimeout(() => setIsRedirecting(false), 1000);
    }
  }, [router, isRedirecting]);

  const authenticatedFetch = useCallback(
    async <T>(
      endpoint: string,
      options: FetchOptions = {}
    ): Promise<AuthenticatedFetchResult<T>> => {
      if (!BASE_URL) {
        throw new Error("API base URL is not defined");
      }

      const { params, ...fetchOptions } = options;
      const url = new URL(`${BASE_URL}${endpoint}`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
      }

      const token = getCookie("authToken");
      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(url.toString(), {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          signal: abortControllerRef.current.signal,
        });

        if (response.status === 403) {
          handleAuthError();
          return { data: null, error: new Error("Authentication failed"), isLoading: false };
        }

        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }

        const data = await response.json();
        return { data, error: null, isLoading: false };
      } catch (error) {
        if (error instanceof Error) {
          return { data: null, error, isLoading: false };
        }
        return { data: null, error: new Error("An unknown error occurred"), isLoading: false };
      }
    },
    [handleAuthError]
  );

  return authenticatedFetch;
}
