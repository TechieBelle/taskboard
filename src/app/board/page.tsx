"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
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
    logout();
    router.push("/login");
  };

  const handleResetBoard = () => {
    resetBoard();
    setResetConfirmOpen(false);
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
    moveTask(taskId, newColumn);
    setActiveTask(null);
  };

  const handleDragCancel = () => setActiveTask(null);

  const handleCreateTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    addTask(taskData);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleUpdateTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
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
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
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
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-black w-9 h-9 flex items-center justify-center">
              <span className="text-white text-xs font-bold tracking-wider">
                H
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Task Board</h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowActivityLog(!showActivityLog)}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition ${
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
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition"
            >
              <Plus size={16} />
              <span>New Task</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search & Filter Toolbar */}
        <BoardToolbar />

        {/* Board + Activity Log */}
        <div
          className={`flex gap-6 ${showActivityLog ? "lg:flex-row flex-col" : ""}`}
        >
          {/* Board Columns */}
          <div className="flex-1 min-w-0">
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <div className="flex gap-4 overflow-x-auto pb-4">
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

              <DragOverlay>
                {activeTask ? (
                  <div className="cursor-grabbing rotate-2 shadow-2xl">
                    <TaskCard
                      task={activeTask}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>

          {/* Activity Log Panel */}
          {showActivityLog && (
            <div className="w-full lg:w-80 flex-shrink-0">
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
