// src/components/MDXContent.tsx
// ⚠️ 此組件已棄用，請改用 MDXRemoteContent (Server Component)
// 目前為了防止編譯錯誤，將 Contentlayer 依賴移除
export default function MDXContent({ raw }: { raw?: string }) {
    return (
        <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
            {raw || "MDX Content Deprecated"}
        </div>
    );
}