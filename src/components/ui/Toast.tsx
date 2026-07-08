"use client";

import { useEffect, useCallback } from "react";
import type { Toast } from "@/redux/types";

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const typeStyles: Record<string, string> = {
  success: "bg-primary text-on-primary",
  error: "bg-error text-on-error",
  info: "bg-surface-container-high text-on-surface",
  warning: "bg-tertiary-container text-on-tertiary-container",
};

const typeIcons: Record<string, string> = {
  success: "check_circle",
  error: "error",
  info: "info",
  warning: "warning",
};

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const handleDismiss = useCallback(() => onDismiss(toast.id), [onDismiss, toast.id]);

  useEffect(() => {
    const duration = toast.duration ?? 4000;
    if (duration <= 0) return;
    const timer = setTimeout(handleDismiss, duration);
    return () => clearTimeout(timer);
  }, [toast.duration, handleDismiss]);

  return (
    <div
      className={[
        "flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl min-w-[280px] max-w-sm animate-in slide-in-from-right",
        typeStyles[toast.type] || typeStyles.info,
      ].join(" ")}
    >
      <span className="material-symbols-outlined text-2xl leading-none shrink-0">
        {typeIcons[toast.type] || typeIcons.info}
      </span>
      <p className="flex-1 text-sm font-label-bold">{toast.message}</p>
      <button
        onClick={handleDismiss}
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <span className="material-symbols-outlined text-xl leading-none">close</span>
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-3 max-sm:bottom-20 max-sm:right-3 max-sm:left-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
