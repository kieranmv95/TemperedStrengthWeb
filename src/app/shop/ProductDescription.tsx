type ProductDescriptionProps = {
  html: string;
};

function prepareDescriptionHtml(html: string): string {
  return html
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/<table/gi, '<div class="size-guide-scroll"><table')
    .replace(/<\/table>/gi, "</table></div>");
}

export default function ProductDescription({ html }: ProductDescriptionProps) {
  if (!html.trim()) return null;

  return (
    <div
      className="shopify-product-description min-w-0 max-w-full overflow-x-hidden"
      dangerouslySetInnerHTML={{ __html: prepareDescriptionHtml(html) }}
    />
  );
}
