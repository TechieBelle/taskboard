"use client";

import { useEffect, useState } from "react";
import { toastManager, type Toast } from "@/lib/toast";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // Subscribe to toast changes
    const unsubscribe = toastManager.subscribe(setToasts);
    return unsubscribe;
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function Toast({ toast }: { toast: Toast }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      toastManager.remove(toast.id);
    }, 300); // Match animation duration
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle size={20} className="text-green-600 flex-shrink-0" />;
      case "error":
        return <AlertCircle size={20} className="text-red-600 flex-shrink-0" />;
      case "warning":
        return <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0" />;
      case "info":
        return <Info size={20} className="text-blue-600 flex-shrink-0" />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "warning":
        return "text-yellow-800";
      case "info":
        return "text-blue-800";
    }
  };

  return (
    <div
      className={`${getBackgroundColor()} border rounded-lg p-4 shadow-lg flex items-start gap-3 transition-all duration-300 ${
        isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
      }`}
      role="status"
      aria-live="polite"
    >
      {getIcon()}
      <span className={`text-sm font-medium flex-1 ${getTextColor()}`}>
        {toast.message}
      </span>
      <button
        onClick={handleClose}
        className={`flex-shrink-0 ${getTextColor()} hover:opacity-70 transition`}
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
}
