"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import BuyButton from "./BuyButton";
import ProductDescription from "./ProductDescription";
import {
  findVariant,
  formatProductPrice,
  getAvailableOptionValues,
  getColorImages,
  getInitialSelections,
  getVariants,
  sortOptionValues,
  type ShopifyProduct,
} from "@/lib/shopify";

type ProductConfiguratorProps = {
  product: ShopifyProduct;
};

const COLOR_SWATCHES: Record<string, string> = {
  black: "#111111",
  coffee: "#6f4e37",
  white: "#f5f5f5",
};

function ProductImage({
  image,
  label,
}: {
  image: { url: string; altText: string | null };
  label: string;
}) {
  return (
    <figure className="space-y-2">
      <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/60">
        <Image
          src={image.url}
          alt={image.altText ?? label}
          width={800}
          height={800}
          className="aspect-square w-full object-cover"
        />
      </div>
      <figcaption className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
        {label}
      </figcaption>
    </figure>
  );
}

function isColorOption(name: string): boolean {
  return name.toLowerCase() === "color" || name.toLowerCase() === "colour";
}

function isSizeOption(name: string): boolean {
  return name.toLowerCase() === "size";
}

function scrollToSizeGuide() {
  document.getElementById("size-guide")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export default function ProductConfigurator({ product }: ProductConfiguratorProps) {
  const variants = useMemo(() => getVariants(product), [product]);
  const [selections, setSelections] = useState<Record<string, string>>(() =>
    getInitialSelections(product)
  );

  const selectedVariant = useMemo(
    () => findVariant(variants, selections),
    [variants, selections]
  );

  const selectedColor = selections.Color ?? selections.Colour;
  const { front, back } = useMemo(() => {
    if (!selectedColor) {
      const images = product.images.edges.map((edge) => edge.node);
      return {
        front: images[0] ?? product.featuredImage,
        back: images[1] ?? null,
      };
    }

    return getColorImages(product, selectedColor, variants);
  }, [product, selectedColor, variants]);

  function updateSelection(optionName: string, value: string) {
    setSelections((current) => {
      const next = { ...current, [optionName]: value };
      const optionIndex = product.options.findIndex(
        (option) => option.name === optionName
      );

      for (const option of product.options.slice(optionIndex + 1)) {
        const availableValues = sortOptionValues(
          option.name,
          getAvailableOptionValues(variants, option.name, next)
        );
        if (!availableValues.includes(next[option.name] ?? "")) {
          next[option.name] = availableValues[0] ?? "";
        }
      }

      return next;
    });
  }

  return (
    <article className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm md:p-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
        <div
          className={
            back
              ? "grid gap-4 sm:grid-cols-2"
              : "mx-auto w-full max-w-md lg:mx-0"
          }
        >
          {front ? (
            <ProductImage image={front} label="Front" />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950/60 text-sm text-neutral-500">
              Front image coming soon
            </div>
          )}
          {back ? <ProductImage image={back} label="Back" /> : null}
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {product.title}
            </h2>
            <p className="text-2xl font-semibold text-[#c9b072]">
              {selectedVariant
                ? formatProductPrice(
                    selectedVariant.price.amount,
                    selectedVariant.price.currencyCode
                  )
                : formatProductPrice(
                    product.priceRange.minVariantPrice.amount,
                    product.priceRange.minVariantPrice.currencyCode
                  )}
            </p>
          </div>

          <div className="space-y-5">
            {product.options.map((option) => {
              const availableValues = sortOptionValues(
                option.name,
                getAvailableOptionValues(variants, option.name, selections)
              );
              const selectedValue = selections[option.name];

              return (
                <div key={option.id} className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">
                        {option.name}
                      </p>
                      {isSizeOption(option.name) ? (
                        <button
                          type="button"
                          onClick={scrollToSizeGuide}
                          className="text-xs text-neutral-500 underline-offset-2 transition hover:text-[#c9b072] hover:underline"
                        >
                          Scroll down for size guide
                        </button>
                      ) : null}
                    </div>
                    {selectedValue ? (
                      <p className="text-sm text-neutral-300">{selectedValue}</p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {availableValues.map((value) => {
                      const isSelected = selectedValue === value;
                      const colorKey = value.toLowerCase();

                      if (isColorOption(option.name)) {
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => updateSelection(option.name, value)}
                            aria-label={`Select ${value}`}
                            aria-pressed={isSelected}
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
                              isSelected
                                ? "border-[#c9b072] bg-[#c9b072]/10 text-white"
                                : "border-neutral-700 bg-neutral-950/60 text-neutral-300 hover:border-neutral-500"
                            }`}
                          >
                            <span
                              className="h-4 w-4 rounded-full border border-neutral-600"
                              style={{
                                backgroundColor:
                                  COLOR_SWATCHES[colorKey] ?? "#737373",
                              }}
                            />
                            {value}
                          </button>
                        );
                      }

                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => updateSelection(option.name, value)}
                          aria-pressed={isSelected}
                          className={`min-w-12 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                            isSelected
                              ? "border-[#c9b072] bg-[#c9b072] text-black"
                              : "border-neutral-700 bg-neutral-950/60 text-neutral-300 hover:border-neutral-500"
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <BuyButton
            variantId={selectedVariant?.id ?? ""}
            disabled={!selectedVariant?.availableForSale}
          />

          {product.descriptionHtml ? (
            <ProductDescription html={product.descriptionHtml} />
          ) : null}
        </div>
      </div>
    </article>
  );
}
