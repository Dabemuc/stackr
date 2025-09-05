import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils"; // your classnames utility
import { Button } from "../ui/button";

export default function Code({
  className,
  children,
  ...props
}: {
  className?: string | undefined;
  children?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string | undefined) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!className) {
    // Inline code
    return (
      <code
        className={cn(
          "px-1.5 py-0.5 rounded text-sm cursor-pointer",
          "bg-[color:var(--color-md-inline-code-bg)] hover:bg-[color:var(--color-md-inline-code-bg-hover)] text-[color:var(--color-md-inline-code)]",
        )}
        onClick={() => handleCopy(children?.toString())}
        title="Click to copy"
        {...props}
      >
        {children}
      </code>
    );
  }

  // Code block
  return (
    <div className="relative group rounded-xl overflow-hidden">
      {/* Display className at top right */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 text-xs text-muted-foreground font-mono cursor-pointer"
        onClick={() => handleCopy(children?.toString())}
      >
        {copied ? "Copied!" : className.replace("language-", "")}
      </Button>

      <pre
        className="overflow-x-auto rounded-xl p-4 text-sm pt-10!"
        style={{
          backgroundColor: "var(--color-md-code-bg)",
          color: "var(--color-md-code)",
        }}
      >
        <code {...props}>{children}</code>
      </pre>
    </div>
  );
}
