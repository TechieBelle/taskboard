"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { toastManager } from "@/lib/toast";
import BoardColumn from "@/components/board/BoardColumn";
import BoardToolbar from "@/components/board/BoardToolbar";
import ActivityLog from "@/components/board/ActivityLog";
import TaskFormModal from "@/components/task/TaskFormModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import TaskCard from "@/components/task/TaskCard";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Task, Column } from "@/types";
import { Plus, RotateCcw, LogOut, ClipboardList } from "lucide-react";

export default function BoardPage() {
  const router = useRouter();
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const isInitialized = useStore((state) => state.isInitialized);
  const initializeStore = useStore((state) => state.initializeStore);
  const logout = useStore((state) => state.logout);
  const resetBoard = useStore((state) => state.resetBoard);
  const getFilteredTasks = useStore((state) => state.getFilteredTasks);
  const moveTask = useStore((state) => state.moveTask);
  const deleteTask = useStore((state) => state.deleteTask);
  const addTask = useStore((state) => state.addTask);
  const updateTask = useStore((state) => state.updateTask);
  const searchQuery = useStore((state) => state.searchQuery);
  const priorityFilter = useStore((state) => state.priorityFilter);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [showActivityLog, setShowActivityLog] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  useEffect(() => {
    initializeStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isInitialized, router]);

  const handleLogout = () => {
    try {
      logout();
      toastManager.info('Logged out successfully');
      router.push("/login");
    } catch (error) {
      console.error('Error during logout:', error);
      toastManager.error('Error logging out. Please try again.');
    }
  };

  const handleResetBoard = () => {
    try {
      resetBoard();
      toastManager.success('Board has been reset. All tasks cleared.');
      setResetConfirmOpen(false);
    } catch (error) {
      console.error('Error resetting board:', error);
      toastManager.error('Failed to reset board. Please try again.');
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const allTasks = getFilteredTasks();
    const task = allTasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }
    const taskId = active.id as string;
    const newColumn = over.id as Column;
    try {
      moveTask(taskId, newColumn);
    } catch (error) {
      console.error('Error moving task:', error);
      toastManager.error('Failed to move task. Please try again.');
    }
    setActiveTask(null);
  };

  const handleDragCancel = () => setActiveTask(null);

  const handleCreateTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    try {
      addTask(taskData);
    } catch (error) {
      console.error('Error creating task:', error);
      toastManager.error('Failed to create task. Please try again.');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleUpdateTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    if (editingTask) {
      try {
        updateTask(editingTask.id, taskData);
        setEditingTask(null);
      } catch (error) {
        console.error('Error updating task:', error);
        toastManager.error('Failed to update task. Please try again.');
      }
    }
  };

  const handleDeleteTask = (id: string) => {
    const allTasks = getFilteredTasks();
    const task = allTasks.find((t) => t.id === id);
    if (task) {
      setTaskToDelete(task);
      setDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      try {
        deleteTask(taskToDelete.id);
        toastManager.success(`Task "${taskToDelete.title}" deleted successfully`);
        setTaskToDelete(null);
      } catch (error) {
        console.error('Error deleting task:', error);
        toastManager.error('Failed to delete task. Please try again.');
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="text-gray-600 mt-4 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const allTasks = getFilteredTasks();
  const todoTasks = allTasks.filter((t) => t.column === "todo");
  const doingTasks = allTasks.filter((t) => t.column === "doing");
  const doneTasks = allTasks.filter((t) => t.column === "done");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex justify-between items-center gap-2 sm:gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="bg-black w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold tracking-wider">
                H
              </span>
            </div>
            <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">Task Board</h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 overflow-x-auto">
            <button
              onClick={() => setShowActivityLog(!showActivityLog)}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-lg border transition whitespace-nowrap ${
                showActivityLog
                  ? "bg-black text-white border-black"
                  : "text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              <ClipboardList size={16} />
              <span className="hidden sm:inline">Activity</span>
            </button>

            <button
              onClick={() => setResetConfirmOpen(true)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition whitespace-nowrap"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-black text-white text-xs sm:text-sm rounded-lg hover:bg-gray-800 transition whitespace-nowrap"
            >
              <Plus size={16} />
              <span className="hidden xs:inline">New Task</span>
              <span className="inline xs:hidden">+</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition whitespace-nowrap"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-6">
        {/* Search & Filter Toolbar */}
        <BoardToolbar />

        {/* Board + Activity Log */}
        <div
          className={`flex flex-col lg:flex-row gap-4 lg:gap-6 ${
            showActivityLog ? "lg:flex-row" : ""
          }`}
        >
          {/* Board Columns */}
          <div className="flex-1 min-w-0">
            {allTasks.length === 0 ? (
              <div className="flex items-center justify-center min-h-[450px] bg-white rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks yet</h3>
                  <p className="text-gray-600 text-sm mb-6 max-w-xs">
                    Create your first task to get started
                  </p>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
                  >
                    Create Task
                  </button>
                </div>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
              >
                <div className="flex flex-row lg:flex-row gap-3 sm:gap-4 pb-3 sm:pb-4 overflow-x-auto lg:overflow-x-visible">
                  <BoardColumn
                    column="todo"
                    title="Todo"
                    tasks={todoTasks}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                  />
                  <BoardColumn
                    column="doing"
                    title="Doing"
                    tasks={doingTasks}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                  />
                  <BoardColumn
                    column="done"
                    title="Done"
                    tasks={doneTasks}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                  />
                </div>

                <DragOverlay dropAnimation={null}>
                  {activeTask ? (
                    <div className="cursor-grabbing rotate-2 shadow-2xl scale-105 origin-center ring-2 ring-purple-400 ring-opacity-50 rounded-lg">
                      <TaskCard
                        task={activeTask}
                        onEdit={() => {}}
                        onDelete={() => {}}
                      />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>

          {/* Activity Log Panel */}
          {showActivityLog && (
            <div className="hidden lg:block w-full lg:w-80 flex-shrink-0">
              <ActivityLog />
            </div>
          )}
        </div>
      </main>

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        editTask={editingTask}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Reset Board Confirmation */}
      <ConfirmModal
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={handleResetBoard}
        title="Reset Board"
        message="Are you sure you want to reset the board? This will delete ALL tasks and activity history. This action cannot be undone."
        confirmText="Reset Board"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
