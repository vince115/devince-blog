// src/components/MDXContent.tsx
"use client";
import { useMDXComponent } from "next-contentlayer/hooks";
import Link from "next/link";


const CustomLink = (props: any) => {
    const href = props.href;
    const isInternal = href && (href.startsWith("/") || href.startsWith("#"));

    if (isInternal) {
        return <Link href={href}>{props.children}</Link>;
    }

    return (
        <a
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:underline"
            {...props}
        />
    );
};

export const MDXComponents = {
    a: CustomLink,
};


export default function MDXContent({
    code,
    raw,
    className = "",
}: {
    code?: string;
    raw?: string;
    className?: string;
}) {
    // ✅ Hook 一定要固定呼叫，避免 conditional hook 錯誤
    // 即使沒有 code，也要傳入空字串讓 Hook 執行，但後面我們會擋掉
    const Component = useMDXComponent(code || "");

    if (!code) {
        // 沒有 MDX 的情況
        return (
            <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap">
                {raw || <p className="text-gray-400">No MDX content to render.</p>}
            </div>
        );
    }

    // 有 MDX 的情況
    return (
        <div className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
                {Component && <Component components={MDXComponents} />}
        </div>
    );
}