"use client";

import { useStore } from "@/lib/store";
import { Search, Filter } from "lucide-react";

export default function BoardToolbar() {
  const searchQuery = useStore((state) => state.searchQuery);
  const priorityFilter = useStore((state) => state.priorityFilter);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setPriorityFilter = useStore((state) => state.setPriorityFilter);

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition bg-white"
        />
      </div>

      {/* Priority Filter */}
      <div className="relative">
        <Filter
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(
              e.target.value as "all" | "low" | "medium" | "high",
            )
          }
          className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition bg-white appearance-none cursor-pointer min-w-[160px]"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Clear Filters */}
      {(searchQuery || priorityFilter !== "all") && (
        <button
          onClick={() => {
            setSearchQuery("");
            setPriorityFilter("all");
          }}
          className="px-4 py-2.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition bg-white whitespace-nowrap"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
