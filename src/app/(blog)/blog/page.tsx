// src/app/blog/page.tsx
import { getAllPosts } from "@/lib/payload-client";
import BlogClient from "./BlogClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog",
  description: "我的技術筆記",
};

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <Suspense fallback={<div className="text-center">Loading blog...</div>}>
      <BlogClient posts={posts} />
    </Suspense>
  );
}
