type ShopifyResponse<T> = {
  data: T;
  errors?: Array<{ message: string }>;
};

type ShopifyProductEdge = {
  node: {
    id: string;
    title: string;
    handle: string;
    featuredImage: {
      url: string;
      altText: string | null;
    } | null;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
        };
      }>;
    };
  };
};

export type ShopifyProduct = ShopifyProductEdge["node"];

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
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
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
