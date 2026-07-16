import ProductConfigurator from "./ProductConfigurator";
import { getVariants, type ShopifyProduct } from "@/lib/shopify";

type ProductCardProps = {
  product: ShopifyProduct;
};

export default function ProductCard({ product }: ProductCardProps) {
  if (getVariants(product).length === 0) return null;

  return <ProductConfigurator product={product} />;
}
