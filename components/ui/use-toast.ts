"use client";

import { toast } from "sonner";

// Exporting toast for direct use if needed
export { toast };

// Custom Hook for Using Toasts
export function useToast() {
  return {
    toast,
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    info: (message: string) => toast.info(message),
    warning: (message: string) => toast.warning(message),
    custom: (message: string) =>
      toast(message, {
        description: "Custom styled notification",
        style: { backgroundColor: "#4CAF50", color: "white" }, // Custom styling
      }),
  };
}
