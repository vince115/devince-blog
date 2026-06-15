//src/components/stats/VisitorCounter.tsx
"use client";

import { useVisitorStats } from "./useVisitorStats";
import { Users, Eye } from "lucide-react";

export default function VisitorCounter() {
    const { visitors, online } = useVisitorStats();

    return (
        <div
            className="
        pointer-events-none
        px-4 py-3
        text-sm
        text-gray-600/80 dark:text-gray-200/80
        space-y-1
      "
            aria-label="visitor statistics"
        >
            {/* 線上人數 */}
            <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="tabular-nums">
                    Online&nbsp;
                    <strong className="font-semibold text-emerald-300">
                        {online}
                    </strong>
                </span>
            </div>

            {/* 到訪人數 */}
            <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-red-800" />
                <span className="tabular-nums">
                    Visits&nbsp;
                    <strong className="font-semibold text-red-700">
                        {visitors.toLocaleString()}
                    </strong>
                </span>
            </div>
        </div>
    );
}
