import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // ⚠️ 請修改為您的實際網域
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
