import { Task, ActivityLog } from '@/types';

const STORAGE_KEYS = {
  TASKS: 'taskboard_tasks',
  ACTIVITY: 'taskboard_activity',
  AUTH: 'taskboard_auth',
  REMEMBER_ME: 'taskboard_remember'
};

// Check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    console.warn('localStorage is not available. Data persistence disabled.');
    return false;
  }
};

// Validate task data structure
const isValidTask = (task: any): task is Task => {
  return (
    task &&
    typeof task === 'object' &&
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.column === 'string' &&
    typeof task.createdAt === 'string'
  );
};

// Validate activity log data structure
const isValidActivityLog = (log: any): log is ActivityLog => {
  return (
    log &&
    typeof log === 'object' &&
    typeof log.id === 'string' &&
    typeof log.action === 'string' &&
    typeof log.taskTitle === 'string' &&
    typeof log.timestamp === 'string'
  );
};

export const storage = {
  // Tasks
  getTasks: (): Task[] => {
    try {
      // Check if localStorage is available
      if (!isLocalStorageAvailable()) {
        return [];
      }

      const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!tasks) {
        return [];
      }

      const parsed = JSON.parse(tasks);
      
      // Validate array structure
      if (!Array.isArray(parsed)) {
        console.warn('Stored tasks data is not an array, resetting.');
        return [];
      }

      // Validate each task object
      const validTasks = parsed.filter((task, index) => {
        if (!isValidTask(task)) {
          console.warn(`Invalid task at index ${index}, skipping.`, task);
          return false;
        }
        return true;
      });

      // If any tasks were filtered, save the cleaned data
      if (validTasks.length !== parsed.length) {
        storage.saveTasks(validTasks);
      }

      return validTasks;
    } catch (error) {
      console.error('Failed to retrieve tasks from storage:', error);
      return [];
    }
  },

  saveTasks: (tasks: Task[]) => {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn('Cannot save tasks - localStorage not available');
        return;
      }

      // Validate input
      if (!Array.isArray(tasks)) {
        console.error('saveTasks expects an array, received:', typeof tasks);
        return;
      }

      const tasksToSave = tasks.filter((task, index) => {
        if (!isValidTask(task)) {
          console.warn(`Invalid task at index ${index}, excluding from save.`);
          return false;
        }
        return true;
      });

      const json = JSON.stringify(tasksToSave);
      
      // Check approximate size (localStorage typical limit is 5-10MB)
      if (json.length > 5 * 1024 * 1024) {
        console.warn('Task data exceeds 5MB, some data may not be saved.');
      }

      localStorage.setItem(STORAGE_KEYS.TASKS, json);
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded. Unable to save tasks.');
      } else {
        console.error('Failed to save tasks:', error);
      }
    }
  },

  // Activity Log
  getActivity: (): ActivityLog[] => {
    try {
      if (!isLocalStorageAvailable()) {
        return [];
      }

      const activity = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
      if (!activity) {
        return [];
      }

      const parsed = JSON.parse(activity);

      if (!Array.isArray(parsed)) {
        console.warn('Stored activity data is not an array, resetting.');
        return [];
      }

      const validLogs = parsed.filter((log, index) => {
        if (!isValidActivityLog(log)) {
          console.warn(`Invalid activity log at index ${index}, skipping.`);
          return false;
        }
        return true;
      });

      if (validLogs.length !== parsed.length) {
        storage.saveActivity(validLogs);
      }

      return validLogs;
    } catch (error) {
      console.error('Failed to retrieve activity log from storage:', error);
      return [];
    }
  },

  saveActivity: (activity: ActivityLog[]) => {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn('Cannot save activity - localStorage not available');
        return;
      }

      if (!Array.isArray(activity)) {
        console.error('saveActivity expects an array, received:', typeof activity);
        return;
      }

      const logsToSave = activity.filter((log, index) => {
        if (!isValidActivityLog(log)) {
          console.warn(`Invalid activity log at index ${index}, excluding from save.`);
          return false;
        }
        return true;
      });

      // Keep only last 500 activity logs to prevent storage bloat
      const trimmedLogs = logsToSave.slice(-500);
      
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(trimmedLogs));
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded. Unable to save activity log.');
      } else {
        console.error('Failed to save activity log:', error);
      }
    }
  },

  // Auth
  getAuth: () => {
    try {
      if (!isLocalStorageAvailable()) {
        return null;
      }

      const auth = localStorage.getItem(STORAGE_KEYS.AUTH);
      
      if (!auth) {
        return null;
      }

      const parsed = JSON.parse(auth);

      if (parsed && typeof parsed.isAuthenticated !== 'boolean') {
        console.warn('Invalid auth data structure, resetting.');
        return null;
      }

      return parsed;
    } catch (error) {
      console.error('Failed to retrieve auth from storage:', error);
      return null;
    }
  },

  saveAuth: (isAuthenticated: boolean) => {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn('Cannot save auth - localStorage not available');
        return;
      }

      if (typeof isAuthenticated !== 'boolean') {
        console.error('saveAuth expects boolean, received:', typeof isAuthenticated);
        return;
      }

      localStorage.setItem(
        STORAGE_KEYS.AUTH,
        JSON.stringify({ isAuthenticated })
      );
    } catch (error) {
      console.error('Failed to save auth:', error);
    }
  },

  clearAuth: () => {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn('Cannot clear auth - localStorage not available');
        return;
      }

      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch (error) {
      console.error('Failed to clear auth:', error);
    }
  },

  // Remember Me
  getRememberMe: () => {
    try {
      if (!isLocalStorageAvailable()) {
        return false;
      }

      const value = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
      return value === 'true';
    } catch (error) {
      console.warn('Failed to get remember me preference:', error);
      return false;
    }
  },

  saveRememberMe: (remember: boolean) => {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn('Cannot save remember me preference - localStorage not available');
        return;
      }

      if (typeof remember !== 'boolean') {
        console.error('saveRememberMe expects boolean, received:', typeof remember);
        return;
      }

      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, String(remember));
    } catch (error) {
      console.error('Failed to save remember me preference:', error);
    }
  },

  // Clear all data
  clearAll: () => {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn('Cannot clear data - localStorage not available');
        return;
      }

      Object.values(STORAGE_KEYS).forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn(`Failed to remove storage key ${key}:`, error);
        }
      });
    } catch (error) {
      console.error('Failed to clear all storage data:', error);
    }
  },

  // Storage diagnostics (for debugging)
  getStorageInfo: () => {
    try {
      if (!isLocalStorageAvailable()) {
        return { available: false, reason: 'localStorage is not available' };
      }

      return {
        available: true,
        tasksSize: localStorage.getItem(STORAGE_KEYS.TASKS)?.length || 0,
        activitySize: localStorage.getItem(STORAGE_KEYS.ACTIVITY)?.length || 0,
        authSize: localStorage.getItem(STORAGE_KEYS.AUTH)?.length || 0,
      };
    } catch (error) {
      return { available: false, reason: 'Error checking storage availability' };
    }
  }
};