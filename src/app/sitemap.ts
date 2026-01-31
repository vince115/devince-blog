import { MetadataRoute } from 'next'
import { allPosts, allProjects } from '@/../.contentlayer/generated'

export default function sitemap(): MetadataRoute.Sitemap {
  // ⚠️ 請修改為您的實際網域，或設定環境變數
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  const posts = allPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const projects = allProjects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.date,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const routes = ['', '/blog', '/projects', '/about'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 1,
  }))

  return [...routes, ...posts, ...projects]
}
