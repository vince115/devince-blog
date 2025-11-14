// src/components/blog/PostMessageBoard.tsx
"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes"; // 若你有用 Tailwind + ThemeProvider
import { useEffect, useState } from "react";

export default function PostMessageBoard() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // 避免 hydration mismatch
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            <Giscus
                id="comments"
                repo="vince115/devince-blog-discussions"
                repoId="R_kgDOQVZONg"
                category="Blog Comments"
                categoryId="DIC_kwDOQVZONs4Cxx7P"
                mapping="pathname"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="bottom"
                lang="zh-TW"
                loading="lazy"
                theme={theme === "dark" ? "dark_dimmed" : "light"}
            />
        </div>
    );
}
