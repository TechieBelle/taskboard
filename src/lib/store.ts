import { create } from 'zustand';
import { Task, ActivityLog, Column, Priority } from '@/types';
import { storage } from './storage';

// Column display name mapping
const COLUMN_NAMES: Record<Column, string> = {
  todo: 'Todo',
  doing: 'In Progress',
  done: 'Done',
};

const getColumnDisplayName = (column: Column): string => COLUMN_NAMES[column];

interface TaskStore {
  // State
  tasks: Task[];
  activityLog: ActivityLog[];
  isAuthenticated: boolean;
  isInitialized: boolean;
  searchQuery: string;
  priorityFilter: Priority | 'all';

  // Actions
  initializeStore: () => void;

  // Auth
  login: (email: string, password: string, rememberMe: boolean) => boolean;
  logout: () => void;

  // Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newColumn: Column) => void;

  // Filters
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (priority: Priority | 'all') => void;

  // Utility
  resetBoard: () => void;

  // Computed
  getFilteredTasks: () => Task[];
}

export const useStore = create<TaskStore>((set, get) => ({
  tasks: [],
  activityLog: [],
  isAuthenticated: false,
  isInitialized: false,
  searchQuery: '',
  priorityFilter: 'all',

  initializeStore: () => {
    if (get().isInitialized) {
      console.log('⚠️ Already initialized, skipping');
      return;
    }

    const tasks = storage.getTasks();
    const activityLog = storage.getActivity();
    const auth = storage.getAuth();
    const rememberMe = storage.getRememberMe();

    console.log('🔍 initializeStore running');
    console.log('   rememberMe:', rememberMe);
    console.log('   auth:', auth);
    console.log('   current isAuthenticated:', get().isAuthenticated);

    const currentlyAuthenticated = get().isAuthenticated;
    const restoredAuthenticated =
      rememberMe === true && auth?.isAuthenticated === true;
    const finalAuthenticated = currentlyAuthenticated || restoredAuthenticated;

    console.log('   Setting isAuthenticated to:', finalAuthenticated);

    set({
      tasks,
      activityLog,
      isAuthenticated: finalAuthenticated,
      isInitialized: true,
    });
  },

  login: (email: string, password: string, rememberMe: boolean) => {
    console.log('🔐 Login called, rememberMe:', rememberMe);

    if (email === 'intern@demo.com' && password === 'intern123') {
      storage.saveAuth(true);
      storage.saveRememberMe(rememberMe);
      set({ isAuthenticated: true });
      console.log('✅ Login success');
      return true;
    }

    console.log('❌ Login failed');
    return false;
  },

  logout: () => {
    storage.clearAuth();
    storage.saveRememberMe(false);
    set({ isAuthenticated: false });
  },

  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };

    const tasks = [...get().tasks, newTask];
    const activity: ActivityLog = {
      id: crypto.randomUUID(),
      action: 'created',
      taskTitle: newTask.title,
      timestamp: new Date().toISOString()
    };

    const activityLog = [activity, ...get().activityLog].slice(0, 50);

    storage.saveTasks(tasks);
    storage.saveActivity(activityLog);
    set({ tasks, activityLog });
  },

  updateTask: (id, updates) => {
    const tasks = get().tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    );

    const task = tasks.find(t => t.id === id);
    const activity: ActivityLog = {
      id: crypto.randomUUID(),
      action: 'edited',
      taskTitle: task?.title || '',
      timestamp: new Date().toISOString()
    };

    const activityLog = [activity, ...get().activityLog].slice(0, 50);

    storage.saveTasks(tasks);
    storage.saveActivity(activityLog);
    set({ tasks, activityLog });
  },

  deleteTask: (id) => {
    const task = get().tasks.find(t => t.id === id);
    const tasks = get().tasks.filter(t => t.id !== id);

    const activity: ActivityLog = {
      id: crypto.randomUUID(),
      action: 'deleted',
      taskTitle: task?.title || '',
      timestamp: new Date().toISOString()
    };

    const activityLog = [activity, ...get().activityLog].slice(0, 50);

    storage.saveTasks(tasks);
    storage.saveActivity(activityLog);
    set({ tasks, activityLog });
  },

  moveTask: (id, newColumn) => {
    const task = get().tasks.find(t => t.id === id);
    const oldColumn = task?.column;

    const tasks = get().tasks.map(t =>
      t.id === id ? { ...t, column: newColumn } : t
    );

    const activity: ActivityLog = {
      id: crypto.randomUUID(),
      action: 'moved',
      taskTitle: task?.title || '',
      timestamp: new Date().toISOString(),
      fromColumn: oldColumn ? getColumnDisplayName(oldColumn) : undefined,
      toColumn: getColumnDisplayName(newColumn),
      details: oldColumn ? `from ${getColumnDisplayName(oldColumn)} to ${getColumnDisplayName(newColumn)}` : undefined,
    };

    const activityLog = [activity, ...get().activityLog].slice(0, 50);

    storage.saveTasks(tasks);
    storage.saveActivity(activityLog);
    set({ tasks, activityLog });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setPriorityFilter: (priority) => set({ priorityFilter: priority }),

  resetBoard: () => {
    storage.clearAll();
    set({
      tasks: [],
      activityLog: [],
      searchQuery: '',
      priorityFilter: 'all'
    });
  },

  getFilteredTasks: () => {
    let filtered = get().tasks;

    if (get().searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(get().searchQuery.toLowerCase())
      );
    }

    if (get().priorityFilter !== 'all') {
      filtered = filtered.filter(task =>
        task.priority === get().priorityFilter
      );
    }

    return filtered.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }
}));