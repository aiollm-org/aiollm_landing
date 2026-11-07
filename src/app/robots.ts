import type { MetadataRoute } from 'next';
import { project } from '@/data/project';
import { indexable } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: indexable
      ? { userAgent: '*', allow: '/' }
      : { userAgent: '*', disallow: '/' },
    sitemap: new URL('sitemap.xml', project.landing).href,
  };
}
