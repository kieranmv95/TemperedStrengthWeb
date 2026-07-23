import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Shop | Tempered Strength",
  description: "Browse Tempered Strength products and check out with Shopify.",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed inset-0 z-[1] bg-[linear-gradient(rgba(201,176,114,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(201,176,114,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-5 sm:py-8 md:py-12">
        <SiteHeader className="mb-6 sm:mb-10 md:mb-12" />

        <section className="mb-6 text-center sm:mb-10 md:mb-14">
          <h1 className="mb-2 text-3xl font-bold tracking-tight sm:mb-4 sm:text-4xl md:text-5xl lg:text-6xl">
            Shop - {products.length}{" "}
            {products.length === 1 ? "product" : "products"}
          </h1>
          <h2 className="text-lg font-medium text-neutral-300">
            Next shipping run: 2 August
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-neutral-400 text-balance">
            Orders placed before 2 August ship on that date. Printing and
            fulfilment then take 2–3 weeks.
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-neutral-400 text-balance">
            Everything is made to order, so we can&apos;t accept returns or
            exchanges at the moment.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-400 text-balance">
            Want <span className="font-semibold text-emerald-500">15% off</span>?
            Find us at an event, or DM us on Instagram.
          </p>
        </section>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 text-center text-neutral-300">
            No products found. Check back soon!
          </div>
        ) : (
          <section className="space-y-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
