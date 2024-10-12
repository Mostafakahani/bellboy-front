import toast, { ToastOptions } from "react-hot-toast";

interface MessageOptions {
  loading?: string;
  success?: string;
  error?: string;
}

export const showSuccess = (message: string, options?: ToastOptions) => {
  toast.success(message, options);
};

// تابع برای نمایش توست خطا
export const showError = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    duration: options?.duration || 4000,
    position: options?.position || "top-right",
    ...options,
  });
};

// تابع برای نمایش توست پرامیس
export const showPromise = (
  promise: Promise<any>,
  messages: MessageOptions,
  options?: ToastOptions
) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || "Sending data...",
      success: messages.success || "Data sent successfully!",
      error: messages.error || "Failed to send data.",
    },
    options
  );
};
