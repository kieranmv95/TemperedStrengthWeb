// app/api/briefs/[slug]/route.ts
import { articles } from "@/data/articles";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return new Response("Not found", { status: 404 });

  return Response.json(article, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
