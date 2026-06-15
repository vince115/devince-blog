import Image from "next/image";
import MDXRemoteContent from "@/components/front/MDXRemoteContent";
import type { Author, Media } from "@/payload-types";

export default function AboutClient({ author }: { author: Author }) {
    const avatarUrl =
        typeof author.avatar === "object" && author.avatar !== null
            ? (author.avatar as Media).url ?? undefined
            : undefined;

    return (
        <section className="max-w-4xl mx-auto py-16 px-6">
            <h1 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white">About</h1>

            <div className="flex flex-col md:flex-row md:items-start md:space-x-12 space-y-8 md:space-y-0">
                <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/3">
                    {avatarUrl && (
                        <div className="relative w-40 h-40 mb-4 overflow-hidden rounded-full border-2 border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <Image
                                src={avatarUrl}
                                alt={author.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{author.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{author.occupation}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">{author.company}</p>
                </div>

                {/* 右側：介紹內容 */}
                <article className="flex-1">
                    {author.bio && (
                        <MDXRemoteContent 
                            source={author.bio} 
                            className="prose-lg" 
                        />
                    )}
                </article>
            </div>
        </section>
    );
}
