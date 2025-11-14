//src/app/blog/BlogClient.tsx
"use client";

import { useSearchParams } from "next/navigation";
import PostCard from "@/components/blog/PostCard";
import Pagination from "@/components/Pagination";

export default function BlogClient({ posts }: { posts: any[] }) {
    const searchParams = useSearchParams();
    const pageParam = searchParams.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 1;

    const perPage = 6;
    const totalPages = Math.ceil(posts.length / perPage);

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pagePosts = posts.slice(start, end);

    return (
        <section className="py-12">
            <div className="max-w-4xl mx-auto px-6">
                <h1 className="text-4xl font-bold mb-2">Blog</h1>
                <p className="text-gray-400 mb-8">我的技術筆記</p>

                {pagePosts.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        目前還沒有文章。
                    </p>
                ) : (
                    <div className="grid gap-8">
                        {pagePosts.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </div>
                )}

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    className="mt-10"
                />

                {/* <p className="text-sm text-gray-400 mt-4">
                    Debug: totalPosts={posts.length}, totalPages={totalPages}, perPage={perPage}
                </p> */}
            </div>
        </section>
    );
}
