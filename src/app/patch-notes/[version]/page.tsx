import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPatchNotesMarkdown, getPatchNotesVersions } from "@/lib/patchNotes";

type PageProps = {
  params: Promise<{ version: string }>;
};

export async function generateStaticParams() {
  const versions = await getPatchNotesVersions();
  return versions.map((version) => ({ version }));
}

export async function generateMetadata({ params }: PageProps) {
  const { version } = await params;
  return {
    title: `Patch Notes ${version} | Tempered Strength`,
    description: `What’s new in Tempered Strength ${version}.`,
  };
}

function Markdown({
  children,
  version,
}: {
  children: string;
  version: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-sm p-5 md:p-8">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => (
            <h1
              className="text-2xl md:text-3xl font-extrabold mt-2 mb-4 text-[#c9b072] tracking-tight"
              {...props}
            />
          ),
          h2: (props) => (
            <h2
              className="text-xl md:text-2xl font-bold mt-8 mb-3 text-[#c9b072] tracking-tight"
              {...props}
            />
          ),
          h3: (props) => (
            <h3
              className="text-lg md:text-xl font-semibold mt-7 mb-2 text-[#c9b072]"
              {...props}
            />
          ),
          p: (props) => (
            <p className="text-neutral-300 leading-loose my-4" {...props} />
          ),
          strong: (props) => (
            <strong className="text-white font-semibold" {...props} />
          ),
          em: (props) => <em className="text-neutral-200 italic" {...props} />,
          a: (props) => (
            <a
              className="text-[#c9b072] hover:text-[#d4c08a] underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          hr: () => <hr className="my-8 border-neutral-800" />,
          pre: (props) => (
            <pre
              className="my-6 overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-950/60 p-4"
              {...props}
            />
          ),
          ul: (props) => <ul className="my-4 ml-5 list-disc space-y-2" {...props} />,
          ol: (props) => <ol className="my-4 ml-5 list-decimal space-y-2" {...props} />,
          li: (props) => <li className="text-neutral-300 leading-relaxed" {...props} />,
          blockquote: (props) => (
            <blockquote
              className="my-6 border-l-2 border-[#c9b072]/50 pl-4 text-neutral-300"
              {...props}
            />
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = Boolean(className);
            if (isBlock) {
              return (
                <code
                  className={`block font-mono text-sm text-neutral-200 ${className ?? ""}`}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className="rounded-md border border-neutral-800 bg-neutral-950/60 px-2 py-0.5 font-mono text-[0.95em] text-neutral-200"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>

      <div className="mt-10 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Link
          href="/patch-notes"
          className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#c9b072] hover:text-[#d4c08a] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          All patch notes
        </Link>
        <span className="text-xs text-neutral-600 font-mono">
          Version: {version}
        </span>
      </div>
    </div>
  );
}

export default async function PatchNotesVersionPage({ params }: PageProps) {
  const { version: rawVersion } = await params;
  const version = decodeURIComponent(rawVersion);

  try {
    const markdown = await getPatchNotesMarkdown(version);

    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="fixed inset-0 z-[1] bg-[linear-gradient(rgba(201,176,114,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(201,176,114,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12">
          <header className="flex justify-center mb-10">
            <Link href="/">
              <Image
                src="/logo_stacked.svg"
                alt="Tempered Strength"
                width={140}
                height={40}
                className="opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
          </header>

          <div className="text-center mb-10">
            <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#c9b072] font-medium mb-4">
              Patch Notes
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Version {version}
            </h1>
            <p className="text-neutral-400 max-w-xl mx-auto leading-relaxed">
              What’s new, improved, and fixed in this release.
            </p>
          </div>

          <Markdown version={version}>{markdown}</Markdown>
        </div>
      </main>
    );
  } catch {
    notFound();
  }
}

