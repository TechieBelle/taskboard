import { Task, ActivityLog } from '@/types';

const STORAGE_KEYS = {
  TASKS: 'taskboard_tasks',
  ACTIVITY: 'taskboard_activity',
  AUTH: 'taskboard_auth',
  REMEMBER_ME: 'taskboard_remember'
};

export const storage = {
  // Tasks
  getTasks: (): Task[] => {
    try {
      const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      return tasks ? JSON.parse(tasks) : [];
    } catch {
      return [];
    }
  },

  saveTasks: (tasks: Task[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  },

  // Activity Log
  getActivity: (): ActivityLog[] => {
    try {
      const activity = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
      return activity ? JSON.parse(activity) : [];
    } catch {
      return [];
    }
  },

  saveActivity: (activity: ActivityLog[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activity));
    } catch (error) {
      console.error('Failed to save activity:', error);
    }
  },

  // Auth
  getAuth: () => {
    try {
      const auth = localStorage.getItem(STORAGE_KEYS.AUTH);
      return auth ? JSON.parse(auth) : null;
    } catch {
      return null;
    }
  },

  saveAuth: (isAuthenticated: boolean) => {
    localStorage.setItem(
      STORAGE_KEYS.AUTH,
      JSON.stringify({ isAuthenticated })
    );
  },

  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  // Remember Me
  getRememberMe: () => {
    return localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
  },

  saveRememberMe: (remember: boolean) => {
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, String(remember));
  },

  // Clear all data
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};