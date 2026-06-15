// src/components/MDXRemoteContent.tsx
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import type { MDXComponents } from "mdx/types";

// 自訂 MDX 元件
const CustomLink = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const href = props.href;
  const isInternal = href && (href.startsWith("/") || href.startsWith("#"));

  if (isInternal) {
    return <Link href={href as string}>{props.children}</Link>;
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

// 自訂 Instagram 元件
const InstagramEmbed = ({ url }: { url: string }) => {
  if (!url) return null;
  let postId = "";
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.pathname.startsWith('/p/') || parsedUrl.pathname.startsWith('/reel/')) {
        const segments = parsedUrl.pathname.split('/');
        postId = segments[2];
    }
  } catch (e) {}

  if (!postId) return <p className="text-red-500 text-sm">無效的 Instagram 網址</p>;

  return (
    <iframe
      src={`https://www.instagram.com/p/${postId}/embed`}
      className="w-full max-w-[400px] mx-auto min-h-[500px] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm my-8"
      frameBorder="0"
      scrolling="no"
      allowTransparency={true}
      allow="encrypted-media"
    />
  );
};

const components: MDXComponents = {
  a: CustomLink as any,
  Instagram: InstagramEmbed,
};

interface MDXRemoteContentProps {
  source: string;
  className?: string;
}

// ⚠️ 這是 React Server Component，直接在 Server 端編譯 MDX
export default async function MDXRemoteContent({
  source,
  className = "",
}: MDXRemoteContentProps) {
  return (
    <div className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              [
                rehypePrettyCode as any,
                {
                  theme: {
                    light: "github-light",
                    dark: "one-dark-pro",
                  },
                  keepBackground: true,
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
