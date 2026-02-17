"use client";

import { Task, Priority, Column } from "@/types";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { validateTaskField, validateAllFields } from "@/lib/validation";
import { toastManager } from "@/lib/toast";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id" | "createdAt">) => void;
  editTask?: Task | null;
}

interface ValidationErrors {
  title?: string;
  description?: string;
  dueDate?: string;
  tags?: string;
}

interface FormDataState {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  tags: string;
  column: string;
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

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [priority, setPriority] = useState(initialPriority);
  const [dueDate, setDueDate] = useState(initialDueDate);
  const [tags, setTags] = useState(initialTags);
  const [column, setColumn] = useState(initialColumn);
  const [errors, setErrors] = useState<ValidationErrorsType>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setDescription(initialDescription);
      setPriority(initialPriority);
      setDueDate(initialDueDate);
      setTags(initialTags);
      setColumn(initialColumn);
      setErrors({});
      setTouched({});
    }
  }, [
    isOpen,
    initialTitle,
    initialDescription,
    initialPriority,
    initialDueDate,
    initialTags,
    initialColumn,
  ]);

  const handleFieldBlur = (fieldName: string, value: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const error = validateTaskField(fieldName, value, editTask?.dueDate);
    setErrors((prev) => {
      const updated = { ...prev };
      if (error) {
        updated[fieldName as keyof ValidationErrorsType] = error;
      } else {
        delete updated[fieldName as keyof ValidationErrorsType];
      }
      return updated;
    });
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    switch (fieldName) {
      case "title":
        setTitle(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "priority":
        setPriority(value);
        break;
      case "dueDate":
        setDueDate(value);
        break;
      case "tags":
        setTags(value);
        break;
      case "column":
        setColumn(value);
        break;
    }

    if (touched[fieldName]) {
      const error = validateTaskField(fieldName, value, editTask?.dueDate);
      setErrors((prev) => {
        const updated = { ...prev };
        if (error) {
          updated[fieldName as keyof ValidationErrorsType] = error;
        } else {
          delete updated[fieldName as keyof ValidationErrorsType];
        }
        return updated;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateAllFields(
      title,
      description,
      dueDate,
      tags,
      editTask?.dueDate,
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({
        title: true,
        description: true,
        dueDate: true,
        tags: true,
      });
      toastManager.error("Please fix the errors in the form");
      return;
    }

    try {
      const taskData = {
        title: title.trim(),
        description: description || undefined,
        priority: (priority as Priority | "") || undefined,
        dueDate: dueDate || undefined,
        tags: tags
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : undefined,
        column: column as Column,
      };

      onSubmit(taskData);

      // Show success toast
      if (editTask) {
        toastManager.success(`Task "${taskData.title}" updated successfully!`);
      } else {
        toastManager.success(`Task "${taskData.title}" created successfully!`);
      }

      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toastManager.error("Failed to save task. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {editTask ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto flex-1"
        >
          {/* Title */}
          <div>
            <div className="flex justify-between items-center mb-1.5 sm:mb-2">
              <label
                htmlFor="title"
                className="block text-xs sm:text-sm font-medium text-gray-700"
              >
                Title <span className="text-red-500">*</span>
              </label>
              {touched.title && !errors.title && (
                <CheckCircle size={16} className="text-green-600" />
              )}
            </div>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              onBlur={() => handleFieldBlur("title", title)}
              required
              className={`w-full px-3 sm:px-3 py-2 sm:py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition ${
                touched.title && errors.title
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-black focus:border-black"
              }`}
              placeholder="Enter task title"
            />
            {touched.title && errors.title && (
              <div className="flex items-center gap-1.5 mt-1 text-red-600">
                <AlertCircle size={14} />
                <span className="text-xs">{errors.title}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-center mb-1.5 sm:mb-2">
              <label
                htmlFor="description"
                className="block text-xs sm:text-sm font-medium text-gray-700"
              >
                Description
              </label>
              {touched.description && !errors.description && (
                <CheckCircle size={16} className="text-green-600" />
              )}
            </div>
            <textarea
              id="description"
              value={description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              onBlur={() => handleFieldBlur("description", description)}
              rows={3}
              className={`w-full px-3 sm:px-3 py-2 sm:py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition ${
                touched.description && errors.description
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-black focus:border-black"
              }`}
              placeholder="Enter task description"
            />
            {touched.description && errors.description && (
              <div className="flex items-center gap-1.5 mt-1 text-red-600">
                <AlertCircle size={14} />
                <span className="text-xs">{errors.description}</span>
              </div>
            )}
          </div>

          {/* Priority */}
          <div>
            <label
              htmlFor="priority"
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
            >
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => handleFieldChange("priority", e.target.value)}
              className="w-full px-3 sm:px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
            >
              <option value="">None</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <div className="flex justify-between items-center mb-1.5 sm:mb-2">
              <label
                htmlFor="dueDate"
                className="block text-xs sm:text-sm font-medium text-gray-700"
              >
                Due Date
              </label>
              {touched.dueDate && !errors.dueDate && (
                <CheckCircle size={16} className="text-green-600" />
              )}
            </div>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => handleFieldChange("dueDate", e.target.value)}
              onBlur={() => handleFieldBlur("dueDate", dueDate)}
              className={`w-full px-3 sm:px-3 py-2 sm:py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition ${
                touched.dueDate && errors.dueDate
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-black focus:border-black"
              }`}
            />
            {touched.dueDate && errors.dueDate && (
              <div className="flex items-center gap-1.5 mt-1 text-red-600">
                <AlertCircle size={14} />
                <span className="text-xs">{errors.dueDate}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <div className="flex justify-between items-center mb-1.5 sm:mb-2">
              <label
                htmlFor="tags"
                className="block text-xs sm:text-sm font-medium text-gray-700"
              >
                Tags
              </label>
              {touched.tags && !errors.tags && (
                <CheckCircle size={16} className="text-green-600" />
              )}
            </div>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => handleFieldChange("tags", e.target.value)}
              onBlur={() => handleFieldBlur("tags", tags)}
              className={`w-full px-3 sm:px-3 py-2 sm:py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition ${
                touched.tags && errors.tags
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-black focus:border-black"
              }`}
              placeholder="e.g. design, urgent, client"
            />
            {touched.tags && errors.tags && (
              <div className="flex items-center gap-1.5 mt-1 text-red-600">
                <AlertCircle size={14} />
                <span className="text-xs">{errors.tags}</span>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Separate tags with commas
            </p>
          </div>

          {/* Column */}
          <div>
            <label
              htmlFor="column"
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
            >
              Column
            </label>
            <select
              id="column"
              value={column}
              onChange={(e) => handleFieldChange("column", e.target.value)}
              className="w-full px-3 sm:px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
            >
              <option value="todo">Todo</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={Object.keys(errors).length > 0}
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm rounded-lg transition ${
                Object.keys(errors).length > 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {editTask ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
