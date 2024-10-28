import { useState, useCallback, useRef, useEffect } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  status?: "success" | "error";
  message?: string[] | string | any;
  data?: T[] | any;
  statusCode?: number;
  token?: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string[] | string;
  statusCode: number;
}

interface AuthenticatedFetchResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  message?: string[] | string | any;
  status?: string;
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
      router.push("/profile/auth");
      setTimeout(() => setIsRedirecting(false), 1000);
    }
  }, [router, isRedirecting]);

  const getErrorMessage = (message: string[] | string): string => {
    if (Array.isArray(message)) {
      return message[0] || "خطای نامشخص";
    }
    return message;
  };

  const authenticatedFetch = useCallback(
    async <T>(
      endpoint: string,
      options: FetchOptions = {}
    ): Promise<AuthenticatedFetchResult<T>> => {
      if (!BASE_URL) {
        return {
          data: null,
          error: new Error("آدرس پایه API تعریف نشده است"),
          isLoading: false,
          message: "خطا در تنظیمات سیستم",
        };
      }

      const { params, ...fetchOptions } = options;
      const url = new URL(`${BASE_URL}${endpoint}`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
      }
      setTimeout(() => {}, 500);

      const token = getCookie("auth_token");
      abortControllerRef.current = new AbortController();
      console.log({ token });
      try {
        const response = await fetch(url.toString(), {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        });

        const responseData = await response.json();

        // بررسی خطای 403
        if (response.status === 401) {
          handleAuthError();
          return {
            data: null,
            error: new Error("خطای احراز هویت"),
            isLoading: false,
            message: "نشست شما منقضی شده است. لطفا دوباره وارد شوید.",
          };
        }

        // بررسی پاسخ‌های موفق
        if (response.ok) {
          // اگر پاسخ شامل token است، آن را برمی‌گردانیم
          if (responseData?.token) {
            return {
              data: responseData,
              error: null,
              isLoading: false,
              message: responseData.message,
              status: responseData.status,
            };
          }

          // برای سایر پاسخ‌های موفق
          return {
            data: responseData.data || responseData,
            error: null,
            isLoading: false,
            message: responseData.message,
            status: responseData.status,
          };
        }

        // مدیریت خطاهای API
        const errorMessage = responseData.message || responseData.error || "خطای نامشخص";
        return {
          data: null,
          error: new Error(getErrorMessage(errorMessage)),
          isLoading: false,
          message: getErrorMessage(errorMessage),
        };
      } catch (error) {
        // خطاهای شبکه
        console.error("Fetch error:", error);
        return {
          data: null,
          error: new Error("خطا در برقراری ارتباط با سرور"),
          isLoading: false,
          message: "لطفا اتصال اینترنت خود را بررسی کنید",
        };
      }
    },
    [handleAuthError]
  );

  return authenticatedFetch;
}
