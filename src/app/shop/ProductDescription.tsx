type ProductDescriptionProps = {
  html: string;
};

export default function ProductDescription({ html }: ProductDescriptionProps) {
  if (!html.trim()) return null;

  return (
    <div
      className="shopify-product-description"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
