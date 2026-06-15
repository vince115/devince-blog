import { MetadataRoute } from "next";
import { getAllPosts, getAllProjects } from "@/lib/payload-client";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);

  const postEntries = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt ?? post.date ?? new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const projectEntries = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.updatedAt ?? project.date ?? new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const routes = ["", "/blog", "/projects", "/about"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 1,
  }));

  return [...routes, ...postEntries, ...projectEntries];
}
