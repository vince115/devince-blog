"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    className?: string;
    scrollToTop?: boolean; // 可選：換頁後是否自動滾回頂端
}

export default function Pagination({
    currentPage,
    totalPages,
    className = "",
    scrollToTop = true,
}: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname(); // ✅ 自動偵測當前頁面路徑（/blog 或 /projects）

    const handleClick = (page: number) => {
        if (page < 1 || page > totalPages) return;

        const params = new URLSearchParams(searchParams);
        params.set("page", String(page));
        router.push(`${pathname}?${params.toString()}`);

        if (scrollToTop) window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const renderPages = () => {
        const pages: (number | "...")[] = [];
        const delta = 2;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== "...") {
                pages.push("...");
            }
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className={`flex items-center justify-center mt-8 space-x-2 ${className}`}>
            <button
                className="px-2 py-2 rounded-md border border-zinc-300/30 dark:border-gray-50/30 text-sm disabled:opacity-10"
                onClick={() => handleClick(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {renderPages().map((p, i) =>
                p === "..." ? (
                    <span key={i} className="px-2 text-gray-400">
                        …
                    </span>
                ) : (
                    <button
                        key={i}
                        onClick={() => handleClick(p)}
                        className={`px-3 py-1.5 rounded-md border border-zinc-300/30 dark:border-gray-50/30 text-sm transition-colors ${p === currentPage
                                ? "bg-blue-600 text-white dark:bg-blue-400 dark:text-black"
                                : "hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                className="px-2 py-2 rounded-md border border-zinc-300/30 dark:border-gray-50/30 text-sm disabled:opacity-10"
                onClick={() => handleClick(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
