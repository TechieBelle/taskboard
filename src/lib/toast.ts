export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

let toasts: Toast[] = [];
let toastListeners: ((toasts: Toast[]) => void)[] = [];

export const toastManager = {
  success: (message: string, duration = 4000) => {
    toastManager.show({
      message,
      type: 'success',
      duration,
    });
  },

  error: (message: string, duration = 5000) => {
    toastManager.show({
      message,
      type: 'error',
      duration,
    });
  },

  warning: (message: string, duration = 4000) => {
    toastManager.show({
      message,
      type: 'warning',
      duration,
    });
  },

  info: (message: string, duration = 3000) => {
    toastManager.show({
      message,
      type: 'info',
      duration,
    });
  },

  show: (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 4000,
    };

    toasts = [...toasts, newToast];
    notifyListeners();

    if (newToast.duration! > 0) {
      setTimeout(() => {
        toastManager.remove(id);
      }, newToast.duration!);
    }

    return id;
  },

  remove: (id: string) => {
    toasts = toasts.filter(t => t.id !== id);
    notifyListeners();
  },

  clear: () => {
    toasts = [];
    notifyListeners();
  },

  getAll: () => toasts,

  subscribe: (listener: (toasts: Toast[]) => void) => {
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  },
};

const notifyListeners = () => {
  toastListeners.forEach(listener => listener([...toasts]));
};
