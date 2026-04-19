// app/api/briefs/route.ts
import { glossary } from "@/data/glossary";

export async function GET() {
  return Response.json(glossary, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
