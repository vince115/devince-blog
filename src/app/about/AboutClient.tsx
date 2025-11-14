// src/app/about/AboutClient.tsx
"use client";

import Image from "next/image";
import { useMDXComponent } from "next-contentlayer/hooks";

export default function AboutClient({ author }: { author: any }) {
    const MDXContent = useMDXComponent(author.body.code);

    return (
        <section className="max-w-4xl mx-auto py-16 px-6">
            <h1 className="text-4xl font-bold mb-10">About</h1>

            <div className="flex flex-col md:flex-row md:items-start md:space-x-12 space-y-8 md:space-y-0">
                <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/2">
                    {author.avatar && (
                        <Image
                            src={author.avatar}
                            alt={author.name}
                            width={160}
                            height={160}
                            className="rounded-full mb-4"
                        />
                    )}
                    <h2 className="text-2xl font-semibold">{author.name}</h2>
                    <p className="text-gray-400">{author.occupation}</p>
                    <p className="text-gray-500">{author.company}</p>
                </div>

                {/* 右側：介紹內容 */}
                <article className="prose dark:prose-invert max-w-none leading-relaxed">
                    <MDXContent />
                </article>
            </div>
        </section>
    );
}
