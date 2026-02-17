"use client";

import { useStore } from "@/lib/store";
import { Search, Filter } from "lucide-react";

export default function BoardToolbar() {
  const searchQuery = useStore((state) => state.searchQuery);
  const priorityFilter = useStore((state) => state.priorityFilter);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setPriorityFilter = useStore((state) => state.setPriorityFilter);

  return (
    <div className="flex flex-col gap-2 sm:gap-3 mb-4 sm:mb-6">
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 sm:pl-10 sm:pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition bg-white"
        />
      </div>

      <div className="flex flex-col xs:flex-row gap-2 items-stretch xs:items-center">
        <div className="relative flex-1 xs:flex-auto">
          <Filter
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(
                e.target.value as "all" | "low" | "medium" | "high",
              )
            }
            className="w-full pl-9 pr-8 sm:pl-10 sm:pr-8 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition bg-white appearance-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {(searchQuery || priorityFilter !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setPriorityFilter("all");
            }}
            className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition bg-white whitespace-nowrap"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
