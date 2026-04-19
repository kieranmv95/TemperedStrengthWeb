// app/api/briefs/route.ts
import { articles } from "@/data/articles"; // wherever your file lives

export async function GET() {
  console.log(articles);
  const sanitizedArticles = articles.map((article) => ({
    title: article.title,
    slug: article.slug,
    subtitle: article.subtitle,
    category: article.category,
    readTime: article.readTime,
    image: article.image,
  }));

  return Response.json(sanitizedArticles, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
