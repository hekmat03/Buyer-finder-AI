"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
}

export function CopyButton({
  text,
}: CopyButtonProps) {
  const [copied, setCopied] =
    useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(
        text
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/70 transition hover:bg-white/5"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}