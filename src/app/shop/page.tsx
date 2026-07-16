import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import BuyButton from "./BuyButton";
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

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 md:py-12">
        <SiteHeader className="mb-12" />

        <section className="mb-14 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[#c9b072] md:text-sm">
            Shopify store
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Shop
          </h1>
          <p className="mx-auto max-w-2xl text-neutral-400 leading-relaxed">
            Browse available products and head straight to Shopify checkout.
          </p>
        </section>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 text-center text-neutral-300">
            No products found. Check back soon!
          </div>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => {
              const variantId = product.variants.edges[0]?.node.id;
              if (!variantId) return null;

              return (
                <article
                  key={product.id}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 text-center backdrop-blur-sm"
                >
                  {product.featuredImage ? (
                    <Image
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText ?? product.title}
                      width={600}
                      height={600}
                      className="aspect-square w-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950/60 text-sm text-neutral-500">
                      Image coming soon
                    </div>
                  )}

                  <h2 className="mt-4 text-xl font-bold">{product.title}</h2>
                  <p className="mt-2 text-neutral-300">
                    {product.priceRange.minVariantPrice.amount}{" "}
                    {product.priceRange.minVariantPrice.currencyCode}
                  </p>
                  <BuyButton variantId={variantId} />
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
