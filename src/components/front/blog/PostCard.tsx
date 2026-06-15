import Image from "next/image";
import Link from "next/link";
import type { Post, Media } from "@/payload-types";

export default function PostCard({ post }: { post: Post }) {
    const coverUrl =
        typeof post.cover === "object" && post.cover !== null
            ? (post.cover as Media).url ?? undefined
            : undefined;

    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group flex flex-col md:flex-row justify-between items-center 
        gap-6 rounded-2xl border border-zinc-300/50 dark:border-zinc-800
        bg-white dark:bg-zinc-700/50 shadow-sm 
        hover:border-blue-400/50 dark:hover:border-blue-600 
        transition-all duration-200"
        >
            {/* 文字區 */}
            <div className="flex-1 space-y-2 p-4">
                {/* 標題 */}
                <h2
                    className="text-2xl font-semibold text-gray-900 dark:text-white 
            group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                >
                    {post.title}
                </h2>

                {/* 日期 */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {post.date &&
                        new Date(post.date).toLocaleDateString("zh-TW", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                </p>

                {/* 摘要描述 */}
                {post.description && (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                        {post.description}
                    </p>
                )}

                {/* 標籤 */}
                {post.tags && (post.tags as any[]).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {(post.tags as any[]).map((tag) => {
                            const tagName = typeof tag === "object" ? tag.value : tag;
                            return (
                                <span
                                    key={tagName}
                                    className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                >
                                    #{tagName}
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 右邊：封面縮圖（固定寬度） */}
            {coverUrl && (
                <div
                    className="relative w-48 h-full min-h-[120px] flex-shrink-0 border border-zinc-300/50 dark:border-zinc-800  rounded-r-2xl overflow-hidden shadow-sm"
                >
                    <Image
                        src={coverUrl}
                        alt={post.title}
                        fill
                        sizes="160px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            )}
        </Link>
    );
}
