// src/app/projects/[slug]/page.tsx
import { allProjects } from "@/../.contentlayer/generated";
import Image from "next/image";
import MDXContent from "@/components/MDXContent";
import { notFound } from "next/navigation";

// 預先生成所有專案路由
export const generateStaticParams = async () =>
    allProjects.map((p) => ({ slug: p.slug }));

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const project = allProjects.find((p) => p.slug === slug);
    if (!project) return notFound();

    return (
        <article className="max-w-4xl mx-auto py-12 px-6 space-y-8">
            {/* Hero Image */}
            {project.image && (
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg shadow-lg">
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            {/* Title + Meta */}
            <header className="space-y-2">
                <h1 className="text-4xl font-bold">{project.title}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(project.date).toLocaleDateString("zh-TW")}
                </p>

            </header>

            {/* 內文區塊 */}
            <section className="prose dark:prose-invert max-w-none">
                <MDXContent code={project.body.code} />
            </section>

            {/* 外部專案連結 */}
            {project.externalUrl && (
                <div className="pt-8 text-right">
                    <a
                        href={(s => s.startsWith("http") ? s : `https://${s}`)(String(project.externalUrl).trim())}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-pink-500 hover:underline"
                    >
                        Visit Project →
                    </a>
                </div>
            )}

        </article>
    );
}
