import ReactMarkdown, { Components } from "react-markdown";
import { cn } from "@/lib/utils";
import Code from "./Code";
import hljs from "highlight.js/lib/common";
import { useEffect } from "react";

export default function CustomMdRenderer({ children }: { children: string }) {
  useEffect(() => {
    console.log("Startin highlighter");
    hljs.highlightAll();
  }, []);

  const components: Components = {
    h1: ({ node, ...props }) => (
      <h1
        className={cn(
          "mb-3 text-2xl font-bold",
          "text-[color:var(--color-md-h1)]",
        )}
        {...props}
      />
    ),
    h2: ({ node, ...props }) => (
      <h2
        className={cn(
          "mt-6 mb-2 text-lg font-semibold",
          "text-[color:var(--color-md-h2)]",
        )}
        {...props}
      />
    ),
    h3: ({ node, ...props }) => (
      <h3
        className={cn(
          "mt-4 mb-2 text-base font-medium",
          "text-[color:var(--color-md-h3)]",
        )}
        {...props}
      />
    ),
    p: ({ node, ...props }) => (
      <p
        className={cn("mb-4 leading-relaxed", "text-[color:var(--color-md-p)]")}
        {...props}
      />
    ),
    ul: ({ node, ...props }) => (
      <ul
        className="list-disc ml-5 mb-4 space-y-2 marker:text-[color:var(--color-md-bullet)]"
        {...props}
      />
    ),
    ol: ({ node, ...props }) => (
      <ol
        className="list-decimal ml-5 mb-4 space-y-2 marker:text-[color:var(--color-md-bullet)]"
        {...props}
      />
    ),
    li: ({ node, ...props }) => (
      <li className="text-[color:var(--color-md-li)] leading-relaxed">
        {props.children}
      </li>
    ),
    a: ({ node, ...props }) => (
      <a
        className="hover:underline text-[color:var(--color-md-link)]"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    code: Code,
  };

  return (
    <article
      className="max-w-3xl rounded-2xl  border"
      style={{
        backgroundColor: "var(--color-md-article-bg)",
        borderColor: "var(--color-md-article-border)",
      }}
    >
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </article>
  );
}
