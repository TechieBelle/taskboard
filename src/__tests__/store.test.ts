import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '@/lib/store';

describe('Task Store', () => {
  beforeEach(() => {
    localStorage.clear();
    useStore.setState({
      tasks: [],
      activityLog: [],
      isAuthenticated: false,
      isInitialized: false,
      searchQuery: '',
      priorityFilter: 'all',
    });
  });

  it('should add a task', () => {
    useStore.getState().addTask({
      title: 'New Task',
      description: 'Test description',
      column: 'todo',
      priority: 'high',
    });

    const tasks = useStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('New Task');
    expect(tasks[0].priority).toBe('high');
  });

  it('should update a task', () => {
    useStore.getState().addTask({
      title: 'Original Title',
      column: 'todo',
    });

    const taskId = useStore.getState().tasks[0].id;
    
    useStore.getState().updateTask(taskId, {
      title: 'Updated Title',
      priority: 'low',
    });

    const updatedTask = useStore.getState().tasks[0];
    expect(updatedTask.title).toBe('Updated Title');
    expect(updatedTask.priority).toBe('low');
  });

  it('should delete a task', () => {
    useStore.getState().addTask({
      title: 'Task to Delete',
      column: 'todo',
    });

    expect(useStore.getState().tasks).toHaveLength(1);
    
    const taskId = useStore.getState().tasks[0].id;
    useStore.getState().deleteTask(taskId);

    expect(useStore.getState().tasks).toHaveLength(0);
  });

  it('should move a task between columns', () => {
    useStore.getState().addTask({
      title: 'Task to Move',
      column: 'todo',
    });

    const taskId = useStore.getState().tasks[0].id;
    useStore.getState().moveTask(taskId, 'doing');

    const movedTask = useStore.getState().tasks[0];
    expect(movedTask.column).toBe('doing');
  });

  it('should track activity when creating task', () => {
    useStore.getState().addTask({
      title: 'New Task',
      column: 'todo',
    });

    const activity = useStore.getState().activityLog;
    expect(activity).toHaveLength(1);
    expect(activity[0].action).toBe('created');
    expect(activity[0].taskTitle).toBe('New Task');
  });

  it('should filter tasks by search query', () => {
    useStore.getState().addTask({ title: 'Buy milk', column: 'todo' });
    useStore.getState().addTask({ title: 'Fix car', column: 'todo' });
    useStore.getState().addTask({ title: 'Buy bread', column: 'todo' });

    useStore.getState().setSearchQuery('buy');
    const filtered = useStore.getState().getFilteredTasks();

    expect(filtered).toHaveLength(2);
    expect(filtered.every(t => t.title.toLowerCase().includes('buy'))).toBe(true);
  });

  it('should filter tasks by priority', () => {
    useStore.getState().addTask({ title: 'Task 1', column: 'todo', priority: 'high' });
    useStore.getState().addTask({ title: 'Task 2', column: 'todo', priority: 'low' });
    useStore.getState().addTask({ title: 'Task 3', column: 'todo', priority: 'high' });

    useStore.getState().setPriorityFilter('high');
    const filtered = useStore.getState().getFilteredTasks();

    expect(filtered).toHaveLength(2);
    expect(filtered.every(t => t.priority === 'high')).toBe(true);
  });
});