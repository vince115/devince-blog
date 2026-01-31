import { allPosts } from "@/../.contentlayer/generated";
import MDXContent from "@/components/MDXContent";
import { notFound } from "next/navigation";
import PostActions from "@/components/blog/PostActions";
import PostNavigator from "@/components/blog/PostNavigator";
import PostMessageBoard from "@/components/blog/PostMessageBoard";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = allPosts.find((p) => p.slug === slug);

    if (!post) {
        return {};
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
    const ogImage = post.cover ? [{ url: post.cover }] : undefined;

    return {
        title: post.title,
        description: post.description,
        alternates: {
            canonical: `/blog/${post.slug}`,
        },
        authors: [{ name: 'Vince' }],
        openGraph: {
            title: post.title,
            description: post.description,
            type: "article",
            publishedTime: post.date,
            url: `${baseUrl}/blog/${post.slug}`,
            images: ogImage,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            images: ogImage,
        },
    };
}

export const generateStaticParams = async () =>
    allPosts.map((p) => ({ slug: p.slug }));

export default async function BlogPost({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const post = allPosts.find((p) => p.slug === slug);
    if (!post) return notFound();

    const posts = [...allPosts].sort(
        (a, b) => +new Date(b.date) - +new Date(a.date)
    );

    const index = posts.findIndex((p) => p._id === post._id);
    const prevPost = index > 0 ? posts[index - 1] : null;
    const nextPost = index < posts.length - 1 ? posts[index + 1] : null;

    return (
        <div className="max-w-6xl mx-auto px-8 bg-white dark:bg-zinc-800/50 py-12 shadow-sm rounded-md ">
            <article className="space-y-6">
                <h1 className="text-3xl font-bold">{post.title}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {/* ⚠️ 建議：考慮改用固定格式以避免 Hydration Mismatch */}
                    {new Date(post.date).toLocaleString("zh-TW")}
                </p>
                <MDXContent code={post.body.code} />
            </article>

            <PostActions />
            <PostMessageBoard />
            <PostNavigator prev={prevPost} next={nextPost} />
        </div>
    );
}
