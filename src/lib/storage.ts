import { Task, ActivityLog } from '@/types';

const STORAGE_KEYS = {
  TASKS: 'taskboard_tasks',
  ACTIVITY: 'taskboard_activity',
  AUTH: 'taskboard_auth',
  REMEMBER_ME: 'taskboard_remember'
};

const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

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
  getTasks: (): Task[] => {
    try {
      if (!isLocalStorageAvailable()) {
        return [];
      }

      const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!tasks) {
        return [];
      }

      const parsed = JSON.parse(tasks);

      if (!Array.isArray(parsed)) {
        return [];
      }

      const validTasks = parsed.filter((task, index) => {
        if (!isValidTask(task)) {
          return false;
        }
        return true;
      });

      if (validTasks.length !== parsed.length) {
        storage.saveTasks(validTasks);
      }

      return validTasks;
    } catch (error) {
      return [];
    }
  },

  saveTasks: (tasks: Task[]) => {
    try {
      if (!isLocalStorageAvailable()) {
        return;
      }

      if (!Array.isArray(tasks)) {
        return;
      }

      const tasksToSave = tasks.filter((task, index) => {
        if (!isValidTask(task)) {
          return false;
        }
        return true;
      });

      const json = JSON.stringify(tasksToSave);

      if (json.length > 5 * 1024 * 1024) {
        return;
      }

      localStorage.setItem(STORAGE_KEYS.TASKS, json);
    } catch (error) {}
  },

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
        return [];
      }

      const validLogs = parsed.filter((log, index) => {
        if (!isValidActivityLog(log)) {
          return false;
        }
        return true;
      });

      if (validLogs.length !== parsed.length) {
        storage.saveActivity(validLogs);
      }

      return validLogs;
    } catch (error) {
      return [];
    }
  },

  saveActivity: (activity: ActivityLog[]) => {
    try {
      if (!isLocalStorageAvailable()) {
        return;
      }

      if (!Array.isArray(activity)) {
        return;
      }

      const logsToSave = activity.filter((log, index) => {
        if (!isValidActivityLog(log)) {
          return false;
        }
        return true;
      });

      const trimmedLogs = logsToSave.slice(-500);

      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(trimmedLogs));
    } catch (error) {}
  },

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
        return null;
      }

      return parsed;
    } catch (error) {
      return null;
    }
  },

  saveAuth: (isAuthenticated: boolean) => {
    try {
      if (!isLocalStorageAvailable()) {
        return;
      }

      if (typeof isAuthenticated !== 'boolean') {
        return;
      }

      localStorage.setItem(
        STORAGE_KEYS.AUTH,
        JSON.stringify({ isAuthenticated })
      );
    } catch (error) {}
  },

  clearAuth: () => {
    try {
      if (!isLocalStorageAvailable()) {
        return;
      }

      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch (error) {}
  },

  getRememberMe: () => {
    try {
      if (!isLocalStorageAvailable()) {
        return false;
      }

      const value = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
      return value === 'true';
    } catch (error) {
      return false;
    }
  },

  saveRememberMe: (remember: boolean) => {
    try {
      if (!isLocalStorageAvailable()) {
        return;
      }

      if (typeof remember !== 'boolean') {
        return;
      }

      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, String(remember));
    } catch (error) {}
  },

  clearAll: () => {
    try {
      if (!isLocalStorageAvailable()) {
        return;
      }

      Object.values(STORAGE_KEYS).forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {}
      });
    } catch (error) {}
  },

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