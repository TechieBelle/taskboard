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
    <div className="w-full lg:flex-1 lg:min-w-[250px] sm:min-w-[280px] md:min-w-[320px]">
      <div className="bg-gray-100 rounded-lg p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="font-bold text-gray-900 text-base sm:text-lg">
            {title}
          </h2>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs sm:text-sm font-medium">
            {tasks.length}
          </span>
        </div>

        <div
          ref={setNodeRef}
          className={`space-y-2 sm:space-y-3 min-h-[200px] p-2 rounded-lg transition-colors ${
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
            <div className="text-center text-gray-400 text-xs sm:text-sm py-8">
              Drop tasks here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
