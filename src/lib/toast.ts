/**
 * Toast Notification System
 * Provides visual feedback for user actions, errors, and success messages
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // milliseconds, 0 = persistent
}

// In-memory store for active toasts (until we implement a toast context)
let toasts: Toast[] = [];
let toastListeners: ((toasts: Toast[]) => void)[] = [];

export const toastManager = {
  /**
   * Show a success toast notification
   */
  success: (message: string, duration = 4000) => {
    toastManager.show({
      message,
      type: 'success',
      duration,
    });
  },

  /**
   * Show an error toast notification
   */
  error: (message: string, duration = 5000) => {
    toastManager.show({
      message,
      type: 'error',
      duration,
    });
  },

  /**
   * Show a warning toast notification
   */
  warning: (message: string, duration = 4000) => {
    toastManager.show({
      message,
      type: 'warning',
      duration,
    });
  },

  /**
   * Show an info toast notification
   */
  info: (message: string, duration = 3000) => {
    toastManager.show({
      message,
      type: 'info',
      duration,
    });
  },

  /**
   * Show a custom toast notification
   */
  show: (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 4000,
    };

    toasts = [...toasts, newToast];
    notifyListeners();

    // Auto-remove after duration (if duration > 0)
    if (newToast.duration > 0) {
      setTimeout(() => {
        toastManager.remove(id);
      }, newToast.duration);
    }

    return id;
  },

  /**
   * Remove a specific toast
   */
  remove: (id: string) => {
    toasts = toasts.filter(t => t.id !== id);
    notifyListeners();
  },

  /**
   * Remove all toasts
   */
  clear: () => {
    toasts = [];
    notifyListeners();
  },

  /**
   * Get all active toasts
   */
  getAll: () => toasts,

  /**
   * Subscribe to toast changes
   */
  subscribe: (listener: (toasts: Toast[]) => void) => {
    toastListeners.push(listener);
    // Return unsubscribe function
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  },
};

// Notify all listeners of toast changes
const notifyListeners = () => {
  toastListeners.forEach(listener => listener([...toasts]));
};

/**
 * Usage Examples:
 * 
 * // Show success message
 * toastManager.success('Task created successfully!');
 * 
 * // Show error message
 * toastManager.error('Failed to save task. Please try again.');
 * 
 * // Show warning
 * toastManager.warning('This action cannot be undone.');
 * 
 * // Show info
 * toastManager.info('Sorting tasks by due date.');
 * 
 * // Persistent message (doesn't auto-hide)
 * toastManager.show({
 *   message: 'Connection lost',
 *   type: 'error',
 *   duration: 0
 * });
 * 
 * // Manual removal
 * const toastId = toastManager.success('Saved!');
 * setTimeout(() => toastManager.remove(toastId), 10000);
 */
