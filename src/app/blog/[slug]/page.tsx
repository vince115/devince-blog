// src/app/blog/[slug]/page.tsx
import { allPosts } from "@/../.contentlayer/generated";
import MDXContent from "@/components/MDXContent";
import { notFound } from "next/navigation";
import PostActions from "@/components/blog/PostActions";
import PostNavigator from "@/components/blog/PostNavigator";
import PostMessageBoard from "@/components/blog/PostMessageBoard";

// 這行會告訴 Next.js 預先生成所有文章頁面
export const generateStaticParams = async () =>
    allPosts.map((p) => ({ slug: p.slug }));

// ✅ 必須是 async + 解構 Promise
export default async function BlogPost({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params; // 👈 關鍵：await params

    // 找出目前文章
    const post = allPosts.find((p) => p.slug === slug);
    if (!post) return notFound();

    // 取得所有文章（按日期排序）
    const posts = [...allPosts].sort(
        (a, b) => +new Date(b.date) - +new Date(a.date)
    );

    // 找出目前文章索引
    const index = posts.findIndex((p) => p._id === post._id);

    // 上一篇（較新的文章）
    const prevPost = index > 0 ? posts[index - 1] : null;

    // 下一篇（較舊的文章）
    const nextPost = index < posts.length - 1 ? posts[index + 1] : null;

    return (
        <div className="max-w-6xl mx-auto px-8 bg-white dark:bg-zinc-800/50 py-12 shadow-sm rounded-md ">
            <article className="space-y-6">
                <h1 className="text-3xl font-bold">{post.title}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {" "}
                    {new Date(post.date).toLocaleString("zh-TW")}{" "}
                </p>
                <MDXContent code={post.body.code} />
            </article>

            
            
            {/* 🗨️ 留言板 */}
            {/* <div className="mt-12 border-t pt-8">
            
            </div> */}
            <PostActions />
            <PostMessageBoard />
            {/* 新增導覽列 */}
            <PostNavigator prev={prevPost} next={nextPost} />


        </div>
    );
}
