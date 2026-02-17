"use client";

import { Task, Column as ColumnType } from "@/types";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTaskCard from "./SortableTaskCard";

interface BoardColumnProps {
  column: ColumnType;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export default function BoardColumn({
  column,
  title,
  tasks,
  onEditTask,
  onDeleteTask,
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column });
  const taskIds = tasks.map((task) => task.id);

  return (
    <div className="flex-1 min-w-[300px]">
      <div className="bg-gray-100 rounded-lg p-4">
        {/* Column Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 text-lg">{title}</h2>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
            {tasks.length}
          </span>
        </div>

        {/* Drop Zone */}
        <div
          ref={setNodeRef}
          className={`space-y-3 min-h-[200px] p-2 rounded-lg transition-colors ${
            isOver ? "bg-blue-50 border-2 border-blue-300 border-dashed" : ""
          }`}
        >
          <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </SortableContext>

          {tasks.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-8">
              Drop tasks here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
