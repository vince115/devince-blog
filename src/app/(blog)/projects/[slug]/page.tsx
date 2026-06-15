// src/app/projects/[slug]/page.tsx
import { getProjectBySlug, getAllProjects } from "@/lib/payload-client";
import Image from "next/image";
import MDXRemoteContent from "@/components/front/MDXRemoteContent";
import { notFound } from "next/navigation";
import type { Media } from "@/payload-types";

// 預先生成所有專案路由
export const generateStaticParams = async () => {
    const projects = await getAllProjects();
    return projects.map((p) => ({ slug: p.slug }));
};

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) return notFound();

    const imageUrl =
        typeof project.cover === "object" && project.cover !== null
            ? (project.cover as Media).url
            : project.cover;

    return (
        <div className="max-w-6xl mx-auto px-8 bg-white dark:bg-zinc-800/50 py-12 shadow-sm rounded-md">
            <article className="space-y-8">
                {/* Hero Image */}
                {imageUrl && (
                    <div className="relative aspect-[16/9] overflow-hidden rounded-lg shadow-lg">
                        <Image
                            src={imageUrl}
                            alt={project.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                {/* Title + Meta */}
                <header className="space-y-2">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(project.date).toLocaleDateString("zh-TW")}
                    </p>
                </header>

                {/* 內文區塊 */}
                {project.content && (
                    <MDXRemoteContent 
                    source={project.content} 
                    className="prose-lg"
                    />
                )}

                {/* 外部專案連結 */}
                {project.url && (
                    <div className="pt-8 text-right">
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-pink-500 hover:underline font-medium"
                        >
                            Visit Project →
                        </a>
                    </div>
                )}

            </article>
        </div>
    );
}
