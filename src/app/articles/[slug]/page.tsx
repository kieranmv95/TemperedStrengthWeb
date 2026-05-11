import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleMarkdownContent } from "@/components/brief/ArticleMarkdownContent";
import { SiteHeader } from "../../../components/SiteHeader";
import { articles } from "@/data/articles";

type Params = { slug: string };

function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article not found | Tempered Strength" };

  return {
    title: `${article.title} | Tempered Strength`,
    description: article.subtitle,
    openGraph: {
      title: article.title,
      description: article.subtitle,
      images: [{ url: article.image }],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed inset-0 z-[1] bg-[linear-gradient(rgba(201,176,114,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(201,176,114,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12">
        <SiteHeader className="mb-6" />
        <div className="mb-8">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#c9b072] hover:text-[#d4c08a] transition-colors"
          >
            <span aria-hidden>←</span>
            Back to Articles
          </Link>
        </div>

        <article className="rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-sm overflow-hidden">
          <div className="relative aspect-[16/9] bg-neutral-900">
            <Image
              src={article.image}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold border border-[#c9b072]/35 text-[#c9b072] bg-[#c9b072]/10">
                  {article.category}
                </span>
                <span className="text-xs text-neutral-200/90">
                  {article.readTime} min read
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight">
                {article.title}
              </h1>
              <p className="text-neutral-200/85 mt-2 leading-relaxed max-w-2xl">
                {article.subtitle}
              </p>
            </div>
          </div>

          <div className="p-5 md:p-8">
            <ArticleMarkdownContent content={article.content} />
          </div>
        </article>
      </div>
    </main>
  );
}

