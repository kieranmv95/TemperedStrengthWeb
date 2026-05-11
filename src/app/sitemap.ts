import type { MetadataRoute } from "next";
import { articles } from "@/data/articles";
import { PUBLIC_SITE_URL } from "@/lib/site";

function u(pathname: string) {
  return new URL(pathname, PUBLIC_SITE_URL).toString();
}

const patchNoteVersions = ["2.1.0", "2.0.0", "1.9.0"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: u("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: u("/programs"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: u("/articles"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...articles.map((a) => ({
      url: u(`/articles/${a.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: u("/patch-notes"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ...patchNoteVersions.map((v) => ({
      url: u(`/patch-notes/${v}`),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
    { url: u("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: u("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}

