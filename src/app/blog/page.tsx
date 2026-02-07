//src/app/blog/page.tsx
import { allPosts } from "@/../.contentlayer/generated";
import BlogClient from "./BlogClient";
import { Suspense } from "react";


export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
    title: "Blog",
    description: "我的技術筆記",
};

export default function BlogIndex() {
    const posts = [...allPosts].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    return (
        <Suspense fallback={<div className="text-center">Loading blog...</div>}>
            <BlogClient posts={posts} />
        </Suspense>
    );
}
