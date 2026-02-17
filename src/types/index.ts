export type Priority = 'low' | 'medium' | 'high';
export type Column = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  column: Column;
}

export interface ActivityLog {
  id: string;
  action: 'created' | 'edited' | 'moved' | 'deleted';
  taskTitle: string;
  timestamp: string;
  details?: string;
}