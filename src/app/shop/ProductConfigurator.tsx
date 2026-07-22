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
  type ShopifyImage,
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
  compact = false,
}: {
  image: ShopifyImage;
  label: string;
  compact?: boolean;
}) {
  return (
    <figure className="space-y-2">
      <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/60">
        <Image
          src={image.url}
          alt={image.altText ?? label}
          width={800}
          height={800}
          className={`w-full object-cover ${
            compact ? "aspect-[4/5] max-h-80" : "aspect-square"
          }`}
        />
      </div>
      <figcaption className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
        {label}
      </figcaption>
    </figure>
  );
}

type GalleryView = "Front" | "Back";

function ProductGallery({
  front,
  back,
}: {
  front: ShopifyImage | null;
  back: ShopifyImage | null;
}) {
  const [activeView, setActiveView] = useState<GalleryView>("Front");

  const slides = [
    front ? { image: front, label: "Front" as const } : null,
    back ? { image: back, label: "Back" as const } : null,
  ].filter((slide): slide is { image: ShopifyImage; label: GalleryView } =>
    Boolean(slide)
  );

  if (slides.length === 0) {
    return (
      <div className="flex aspect-[4/5] max-h-80 w-full items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950/60 text-sm text-neutral-500">
        Images coming soon
      </div>
    );
  }

  if (slides.length === 1) {
    return <ProductImage image={slides[0].image} label={slides[0].label} compact />;
  }

  const activeSlide =
    slides.find((slide) => slide.label === activeView) ?? slides[0];

  return (
    <>
      <div className="space-y-3 sm:hidden">
        <div className="flex gap-2">
          {slides.map((slide) => (
            <button
              key={slide.label}
              type="button"
              onClick={() => setActiveView(slide.label)}
              aria-pressed={activeView === slide.label}
              className={`min-h-10 flex-1 rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                activeView === slide.label
                  ? "border-[#c9b072] bg-[#c9b072] text-black"
                  : "border-neutral-700 bg-neutral-950/60 text-neutral-300"
              }`}
            >
              {slide.label}
            </button>
          ))}
        </div>
        <ProductImage
          image={activeSlide.image}
          label={activeSlide.label}
          compact
        />
      </div>

      <div className="hidden gap-4 sm:grid sm:grid-cols-2">
        {slides.map((slide) => (
          <ProductImage key={slide.label} image={slide.image} label={slide.label} />
        ))}
      </div>
    </>
  );
}

function isColorOption(name: string): boolean {
  return name.toLowerCase() === "color" || name.toLowerCase() === "colour";
}

function isSizeOption(name: string): boolean {
  return name.toLowerCase() === "size";
}

function scrollToSizeGuide() {
  const element = document.getElementById("size-guide");
  if (!element) return;

  const scrollTarget = element.closest(".size-guide-scroll") ?? element;
  scrollTarget.scrollIntoView({
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
  const priceLabel = selectedVariant
    ? formatProductPrice(
        selectedVariant.price.amount,
        selectedVariant.price.currencyCode
      )
    : formatProductPrice(
        product.priceRange.minVariantPrice.amount,
        product.priceRange.minVariantPrice.currencyCode
      );

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
    <article className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 backdrop-blur-sm sm:p-6 md:p-8">
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10 lg:items-start">
        <div className="order-2 min-w-0 lg:order-none lg:row-span-2">
          <ProductGallery front={front} back={back} />
        </div>

        <div className="order-1 min-w-0 space-y-5 lg:order-none">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              {product.title}
            </h2>
            <p className="text-xl font-semibold text-[#c9b072] sm:text-2xl">
              {priceLabel}
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {product.options.map((option) => {
              const availableValues = sortOptionValues(
                option.name,
                getAvailableOptionValues(variants, option.name, selections)
              );
              const selectedValue = selections[option.name];

              return (
                <div key={option.id} className="space-y-2.5 sm:space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">
                        {option.name}
                      </p>
                      {isSizeOption(option.name) ? (
                        <button
                          type="button"
                          onClick={scrollToSizeGuide}
                          className="text-left text-xs text-neutral-500 underline-offset-2 transition hover:text-[#c9b072] hover:underline"
                        >
                          Scroll down for size guide
                        </button>
                      ) : null}
                    </div>
                    {selectedValue ? (
                      <p className="shrink-0 text-sm text-neutral-300">
                        {selectedValue}
                      </p>
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
                            className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
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
                          className={`inline-flex min-h-11 min-w-12 items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold transition ${
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
            fullWidth
            className="w-full"
          />
        </div>

        {product.descriptionHtml ? (
          <div className="order-3 min-w-0 max-w-full lg:order-none lg:col-start-2">
            <ProductDescription html={product.descriptionHtml} />
          </div>
        ) : null}
      </div>
    </article>
  );
}
