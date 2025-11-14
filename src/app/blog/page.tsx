//src/app/blog/page.tsx
import { allPosts } from "@/../.contentlayer/generated";
import BlogClient from "./BlogClient";
import { Suspense } from "react";


export const revalidate = 0;

export const metadata = {
    title: "Blog",
    description: "我的技術筆記",
};

export default function BlogIndex() {
    const posts = [...allPosts].sort(
        (a, b) => +new Date(b.date) - +new Date(a.date)
    );
    return (
        <Suspense fallback={<div className="text-center">Loading blog...</div>}>
            <BlogClient posts={posts} />
        </Suspense>
    );
}
