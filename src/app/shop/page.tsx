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
          <h2 className="text-lg font-medium text-neutral-400">Next shipping run is August 2nd</h2>
          <p className="text-sm text-neutral-400">All order placed before August 2nd will be shipped on August 2nd, the printing process through to fulfillment will take 2-3 weeks.</p>
          <p className="text-sm text-neutral-400">All orders are made to order so currently we are unable to accept returns or exchanges.</p>
          <p className="mt-4 text-sm text-neutral-400">Want <span className="text-emerald-500">15%</span> off? Come find us at any of our events or DM us on instagram.</p>
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
