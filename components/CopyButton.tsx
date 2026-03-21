"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      className="rounded-lg bg-[#E8404A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#d13640] disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {copied ? "Copied!" : "Copy Sanitized Config"}
    </button>
  );
}
