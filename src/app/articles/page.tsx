"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { articles } from "@/data/articles";
import { SiteHeader } from "../../components/SiteHeader";

type Category = (typeof articles)[number]["category"];

function uniqCategories(list: { category: Category }[]) {
  const set = new Set<Category>();
  for (const a of list) set.add(a.category);
  return Array.from(set);
}

export default function ArticlesPage() {
  const categories = useMemo(() => uniqCategories(articles), []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles
      .filter((a) => (category === "All" ? true : a.category === category))
      .filter((a) => {
        if (!q) return true;
        const hay = `${a.title} ${a.subtitle}`.toLowerCase();
        return hay.includes(q);
      });
  }, [query, category]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed inset-0 z-[1] bg-[linear-gradient(rgba(201,176,114,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(201,176,114,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12">
        <SiteHeader className="mb-10" />

        <div className="text-center mb-10">
          <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#c9b072] font-medium mb-4">
            The Brief
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Articles
          </h1>
          <p className="text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Short, practical reads on training methodology, nutrition, recovery,
            mindset, and technique.
          </p>
        </div>

        <section
          id="browse"
          className="rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-sm p-4 md:p-5 mb-8 scroll-mt-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label
                htmlFor="article-search"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2"
              >
                Search
              </label>
              <input
                id="article-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles and subtitles..."
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950/60 px-4 py-3 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-[#c9b072]/60 focus:ring-2 focus:ring-[#c9b072]/20"
              />
            </div>

            <div>
              <label
                htmlFor="article-category"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2"
              >
                Category
              </label>
              <select
                id="article-category"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as Category | "All")
                }
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950/60 px-4 py-3 text-sm text-white outline-none focus:border-[#c9b072]/60 focus:ring-2 focus:ring-[#c9b072]/20"
              >
                <option value="All">All</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p className="text-sm text-neutral-500">
              {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </p>
            {(query.trim() || category !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#c9b072] hover:text-[#d4c08a] transition-colors"
              >
                Clear filters
                <span aria-hidden>×</span>
              </button>
            )}
          </div>
        </section>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-8 text-center">
            <p className="text-neutral-300 font-semibold mb-2">No matches</p>
            <p className="text-neutral-500 text-sm">
              Try a different search term or switch category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filtered.map((a) => (
              <Link
                key={a.id}
                href={`/articles/${a.slug}`}
                className="group rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900/70 backdrop-blur-sm overflow-hidden transition-colors"
              >
                <div className="relative aspect-[16/9] bg-neutral-900">
                  <Image
                    src={a.image}
                    alt=""
                    fill
                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold border border-[#c9b072]/35 text-[#c9b072] bg-[#c9b072]/10">
                      {a.category}
                    </span>
                    <span className="text-xs text-neutral-200/90">
                      {a.readTime} min read
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-bold leading-snug mb-1">
                    {a.title}
                  </h2>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {a.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

