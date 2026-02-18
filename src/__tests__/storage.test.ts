import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '@/lib/storage';
import { Task, ActivityLog } from '@/types';

describe('Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save and retrieve tasks', () => {
    const tasks: Task[] = [
      {
        id: '1',
        title: 'Test Task',
        column: 'todo',
        createdAt: new Date().toISOString(),
      },
    ];

    storage.saveTasks(tasks);
    const retrieved = storage.getTasks();

    expect(retrieved).toHaveLength(1);
    expect(retrieved[0].title).toBe('Test Task');
  });

  it('should return empty array when no tasks exist', () => {
    const tasks = storage.getTasks();
    expect(tasks).toEqual([]);
  });

  it('should save and retrieve activity log', () => {
    const activity: ActivityLog[] = [
      {
        id: '1',
        action: 'created',
        taskTitle: 'Test Task',
        timestamp: new Date().toISOString(),
      },
    ];

    storage.saveActivity(activity);
    const retrieved = storage.getActivity();

    expect(retrieved).toHaveLength(1);
    expect(retrieved[0].action).toBe('created');
  });

  it('should clear all storage', () => {
    storage.saveTasks([
      {
        id: '1',
        title: 'Test',
        column: 'todo',
        createdAt: new Date().toISOString(),
      },
    ]);
    storage.saveAuth(true);

    storage.clearAll();

    expect(storage.getTasks()).toEqual([]);
    expect(storage.getAuth()).toBeNull();
  });
});