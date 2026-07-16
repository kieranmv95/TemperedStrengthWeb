type ShopifyResponse<T> = {
  data: T;
  errors?: Array<{ message: string }>;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
};

export type ShopifyOption = {
  id: string;
  name: string;
  values: string[];
};

export type ShopifyVariant = {
  id: string;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
  price: {
    amount: string;
    currencyCode: string;
  };
  image: ShopifyImage | null;
};

type ShopifyProductEdge = {
  node: {
    id: string;
    title: string;
    handle: string;
    descriptionHtml: string;
    featuredImage: ShopifyImage | null;
    options: ShopifyOption[];
    images: {
      edges: Array<{
        node: ShopifyImage;
      }>;
    };
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    variants: {
      edges: Array<{
        node: ShopifyVariant;
      }>;
    };
  };
};

export type ShopifyProduct = ShopifyProductEdge["node"];

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

export function getProductImages(product: ShopifyProduct): ShopifyImage[] {
  return product.images.edges.map((edge) => edge.node);
}

export function getVariants(product: ShopifyProduct): ShopifyVariant[] {
  return product.variants.edges.map((edge) => edge.node);
}

export function sortOptionValues(optionName: string, values: string[]): string[] {
  if (optionName.toLowerCase() === "size") {
    return [...values].sort((a, b) => {
      const aIndex = SIZE_ORDER.indexOf(a);
      const bIndex = SIZE_ORDER.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }

  return values;
}

export function getVariantOptionValue(
  variant: ShopifyVariant,
  optionName: string
): string | undefined {
  return variant.selectedOptions.find((option) => option.name === optionName)?.value;
}

export function findVariant(
  variants: ShopifyVariant[],
  selections: Record<string, string>
): ShopifyVariant | undefined {
  return variants.find((variant) =>
    variant.selectedOptions.every(
      (option) => selections[option.name] === option.value
    )
  );
}

export function getAvailableOptionValues(
  variants: ShopifyVariant[],
  optionName: string,
  selections: Record<string, string>
): string[] {
  const matchingVariants = variants.filter((variant) => {
    if (!variant.availableForSale) return false;

    return Object.entries(selections).every(([name, value]) => {
      if (name === optionName) return true;
      return getVariantOptionValue(variant, name) === value;
    });
  });

  const values = new Set(
    matchingVariants
      .map((variant) => getVariantOptionValue(variant, optionName))
      .filter((value): value is string => Boolean(value))
  );

  return Array.from(values);
}

export function getColorImages(
  product: ShopifyProduct,
  color: string,
  variants: ShopifyVariant[]
): { front: ShopifyImage | null; back: ShopifyImage | null } {
  const images = getProductImages(product);
  const colorVariant = variants.find(
    (variant) => getVariantOptionValue(variant, "Color") === color && variant.image
  );
  const frontUrl = colorVariant?.image?.url ?? images[0]?.url ?? null;
  const frontIndex = frontUrl
    ? images.findIndex((image) => image.url === frontUrl)
    : -1;
  const front =
    frontIndex >= 0
      ? images[frontIndex]
      : colorVariant?.image ?? product.featuredImage;
  const back =
    frontIndex >= 0 && images[frontIndex + 1] ? images[frontIndex + 1] : null;

  return { front, back };
}

export function getInitialSelections(product: ShopifyProduct): Record<string, string> {
  const variants = getVariants(product).filter((variant) => variant.availableForSale);
  const selections: Record<string, string> = {};

  for (const option of product.options) {
    const values = getAvailableOptionValues(variants, option.name, selections);
    const sortedValues = sortOptionValues(option.name, values);
    if (sortedValues[0]) {
      selections[option.name] = sortedValues[0];
    }
  }

  return selections;
}

export function formatProductPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}

function getShopifyDomain(): string {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) throw new Error("SHOPIFY_STORE_DOMAIN is not configured");
  return domain;
}

function getShopifyToken(): string {
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
  if (!token) throw new Error("SHOPIFY_STOREFRONT_TOKEN is not configured");
  return token;
}

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const response = await fetch(
    `https://${getShopifyDomain()}/api/2026-01/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Shopify-Storefront-Private-Token": getShopifyToken(),
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    throw new Error(`Shopify request failed with status ${response.status}`);
  }

  const json = (await response.json()) as ShopifyResponse<T>;
  if (json.errors?.length) {
    console.error(json.errors);
    throw new Error("Shopify API error");
  }

  return json.data;
}

export async function getProducts(): Promise<ShopifyProduct[]> {
  const query = `
    query Products {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            descriptionHtml
            options {
              id
              name
              values
            }
            featuredImage {
              url
              altText
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 50) {
              edges {
                node {
                  id
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                  price {
                    amount
                    currencyCode
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    products: { edges: ShopifyProductEdge[] };
  }>(query);

  return data.products.edges
    .map((edge) => edge.node)
    .filter((product) => product.variants.edges.length > 0);
}
