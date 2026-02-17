"use client";

import { Task, Priority, Column } from "@/types";
import { X } from "lucide-react";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id" | "createdAt">) => void;
  editTask?: Task | null;
}

export default function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  editTask,
}: TaskFormModalProps) {
  const initialTitle = editTask?.title ?? "";
  const initialDescription = editTask?.description ?? "";
  const initialPriority = editTask?.priority ?? "";
  const initialDueDate = editTask?.dueDate ?? "";
  const initialTags = editTask?.tags?.join(", ") ?? "";
  const initialColumn = editTask?.column ?? "todo";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tags = formData.get("tags") as string;

    const taskData = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      priority: (formData.get("priority") as Priority | "") || undefined,
      dueDate: (formData.get("dueDate") as string) || undefined,
      tags: tags
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined,
      column: formData.get("column") as Column,
    };

    onSubmit(taskData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {editTask ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={initialTitle}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={initialDescription}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              placeholder="Enter task description"
            />
          </div>

          {/* Priority */}
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              defaultValue={initialPriority}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
            >
              <option value="">None</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Due Date
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              defaultValue={initialDueDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
            />
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tags
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              defaultValue={initialTags}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              placeholder="e.g. design, urgent, client"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Column */}
          <div>
            <label
              htmlFor="column"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Column
            </label>
            <select
              id="column"
              name="column"
              defaultValue={initialColumn}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
            >
              <option value="todo">Todo</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              {editTask ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
