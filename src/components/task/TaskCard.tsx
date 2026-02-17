"use client";

import { Task } from "@/types";
import { Trash2, Edit, Calendar, Tag, AlertCircle } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  const isOverdue =
    task.dueDate &&
    task.column !== "done" &&
    new Date(task.dueDate) < new Date();

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${
        isOverdue ? "border-red-300 bg-red-50" : "border-gray-200"
      }`}
    >
      {/* Title + Buttons */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 flex-1 text-sm leading-snug">
          {task.title}
        </h3>
        <div
          className="flex gap-1 ml-2 flex-shrink-0"
          style={{ pointerEvents: "auto" }}
        >
          <button
            onClick={handleEdit}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600 transition"
            title="Edit task"
          >
            <Edit size={15} />
          </button>
          <button
            onClick={handleDelete}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600 transition"
            title="Delete task"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Created At */}
      <p className="text-xs text-gray-400 mb-2">
        Created: {new Date(task.createdAt).toLocaleDateString()}
      </p>

      {/* Priority, Due Date, Tags */}
      <div className="flex flex-wrap gap-2 items-center text-xs">
        {task.priority && (
          <span
            className={`px-2 py-0.5 rounded-full font-medium capitalize ${priorityColors[task.priority]}`}
          >
            {task.priority}
          </span>
        )}

        {task.dueDate && (
          <span
            className={`flex items-center gap-1 ${isOverdue ? "text-red-600 font-semibold" : "text-gray-500"}`}
          >
            {isOverdue && <AlertCircle size={13} />}
            <Calendar size={13} />
            {new Date(task.dueDate).toLocaleDateString()}
            {isOverdue && <span>(Overdue)</span>}
          </span>
        )}

        {task.tags && task.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap w-full mt-1">
            <Tag size={13} className="text-gray-400" />
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
