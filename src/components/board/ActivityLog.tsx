"use client";

import { useStore } from "@/lib/store";
import { CheckCircle, Edit, Trash2, ArrowRight, Clock } from "lucide-react";

export default function ActivityLog() {
  const activityLog = useStore((state) => state.activityLog);

  const actionConfig = {
    created: {
      icon: <CheckCircle size={14} className="text-green-600" />,
      color: "text-green-600",
      label: "Created",
    },
    edited: {
      icon: <Edit size={14} className="text-blue-600" />,
      color: "text-blue-600",
      label: "Edited",
    },
    moved: {
      icon: <ArrowRight size={14} className="text-purple-600" />,
      color: "text-purple-600",
      label: "Moved",
    },
    deleted: {
      icon: <Trash2 size={14} className="text-red-600" />,
      color: "text-red-600",
      label: "Deleted",
    },
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
        <Clock size={16} className="text-gray-500 flex-shrink-0" />
        <h3 className="font-semibold text-gray-900 text-sm">Activity Log</h3>
        {activityLog.length > 0 && (
          <span className="ml-auto text-xs text-gray-500">
            {activityLog.length} action{activityLog.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {activityLog.length === 0 ? (
          <div className="px-3 sm:px-4 py-6 sm:py-8 text-center text-gray-400 text-xs sm:text-sm">
            No activity yet
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {activityLog.map((log) => {
              const config = actionConfig[log.action];

              const isMoved = log.action === "moved";

              return (
                <li
                  key={log.id}
                  className="px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0 text-sm">
                      {config.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-900">
                        <span className={`font-medium ${config.color}`}>
                          {config.label}
                        </span>{" "}
                        <span className="font-medium line-clamp-1">
                          {log.taskTitle}
                        </span>
                      </p>

                      {isMoved && log.fromColumn && log.toColumn ? (
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                          <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-medium">
                            {log.fromColumn}
                          </span>
                          <ArrowRight
                            size={12}
                            className="text-gray-400 flex-shrink-0"
                          />
                          <span className="px-1.5 py-0.5 bg-purple-100 rounded text-purple-700 font-medium">
                            {log.toColumn}
                          </span>
                        </div>
                      ) : log.details ? (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {log.details}
                        </p>
                      ) : null}

                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatTime(log.timestamp)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
