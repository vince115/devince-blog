// src/app/tags/[tag]/page.tsx
import { allPosts } from "contentlayer/generated";
import { fromTagSlug, toTagSlug } from "@/lib/tags";
import Link from "next/link";
import PostCard from "@/components/blog/PostCard";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const uniq = new Set<string>();
  for (const p of allPosts) for (const t of p.tags ?? []) uniq.add(toTagSlug(t));
  return [...uniq].map((s) => ({ tag: s }));
}

export default async function TagDetail({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params; // Next 16: params 為 Promise
  const normalized = fromTagSlug(tag);

  const posts = allPosts
    .filter((p) =>
      (p.tags ?? []).some((t) => toTagSlug(t) === toTagSlug(normalized))
    )
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  if (posts.length === 0) return notFound();

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-8">
          <Link
            href="/tags"
            className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
          >
            ← 所有標籤
          </Link>
          <h1 className="mt-2 text-4xl font-extrabold">
            #{normalized.toUpperCase()}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {posts.length} 篇文章
          </p>
        </div>

        <div className="grid gap-8">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
