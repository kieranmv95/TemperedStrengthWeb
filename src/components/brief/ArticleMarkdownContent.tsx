import React from "react";

type Segment =
  | { type: "text"; value: string }
  | { type: "bold"; value: string };

function splitInlineBold(text: string): Segment[] {
  // Supports inline **bold** segments. Unmatched ** are treated as plain text.
  const segments: Segment[] = [];
  const parts = text.split("**");

  for (let i = 0; i < parts.length; i++) {
    const value = parts[i];
    if (!value) continue;

    if (i % 2 === 1) segments.push({ type: "bold", value });
    else segments.push({ type: "text", value });
  }

  // If there was an unmatched opening **, treat everything as text.
  if (parts.length % 2 === 0) {
    return [{ type: "text", value: text }];
  }

  return segments;
}

function renderInline(text: string) {
  const segments = splitInlineBold(text);
  return segments.map((seg, idx) => {
    if (seg.type === "bold") return <strong key={idx}>{seg.value}</strong>;
    return <React.Fragment key={idx}>{seg.value}</React.Fragment>;
  });
}

export function ArticleMarkdownContent({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");

  const elements: React.ReactNode[] = [];
  let pendingUlItems: string[] = [];
  let pendingOlItems: string[] = [];

  const flushUl = () => {
    if (!pendingUlItems.length) return;
    elements.push(
      <ul
        key={`ul-${elements.length}`}
        className="list-disc pl-5 space-y-2 text-neutral-200"
      >
        {pendingUlItems.map((item, idx) => (
          <li key={idx} className="leading-relaxed">
            {renderInline(item)}
          </li>
        ))}
      </ul>
    );
    pendingUlItems = [];
  };

  const flushOl = () => {
    if (!pendingOlItems.length) return;
    elements.push(
      <ol
        key={`ol-${elements.length}`}
        className="list-decimal pl-5 space-y-2 text-neutral-200"
      >
        {pendingOlItems.map((item, idx) => (
          <li key={idx} className="leading-relaxed">
            {renderInline(item)}
          </li>
        ))}
      </ol>
    );
    pendingOlItems = [];
  };

  const flushLists = () => {
    flushUl();
    flushOl();
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushLists();
      elements.push(<div key={`spacer-${elements.length}`} className="h-4" />);
      continue;
    }

    if (trimmed.startsWith("# ")) {
      flushLists();
      elements.push(
        <h1
          key={`h1-${elements.length}`}
          className="text-2xl md:text-3xl font-extrabold mt-7 mb-3 text-[#c9b072] tracking-tight"
        >
          {renderInline(trimmed.slice(2).trim())}
        </h1>
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushLists();
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          className="text-xl md:text-2xl font-bold mt-6 mb-2.5 text-[#c9b072] tracking-tight"
        >
          {renderInline(trimmed.slice(3).trim())}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushLists();
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          className="text-lg md:text-xl font-semibold mt-5 mb-2 text-[#c9b072]"
        >
          {renderInline(trimmed.slice(4).trim())}
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith("- ")) {
      flushOl();
      pendingUlItems.push(trimmed.slice(2).trim());
      continue;
    }

    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (orderedMatch) {
      flushUl();
      pendingOlItems.push(orderedMatch[2].trim());
      continue;
    }

    flushLists();
    elements.push(
      <p
        key={`p-${elements.length}`}
        className="text-neutral-300 leading-relaxed"
      >
        {renderInline(trimmed)}
      </p>
    );
  }

  flushLists();

  return <div className="space-y-3">{elements}</div>;
}

