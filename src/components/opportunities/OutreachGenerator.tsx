"use client";

import { useState } from "react";

import type {
  QualificationResult,
} from "@/lib/qualification/types";

interface OutreachGeneratorProps {
  content: string;
  qualification: QualificationResult;
}

export function OutreachGenerator({
  content,
  qualification,
}: OutreachGeneratorProps) {
  const [style, setStyle] =
    useState("professional");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function generate() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/outreach",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            content,
            qualification,
            style,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to generate outreach."
        );
      }

      setMessage(data.message);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate outreach."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="text-lg font-semibold text-white">
        Outreach Draft
      </h3>

      <div className="mt-4 flex gap-3">
        <select
          value={style}
          onChange={(event) =>
            setStyle(event.target.value)
          }
          className="rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white"
        >
          <option value="professional">
            Professional
          </option>
          <option value="friendly">
            Friendly
          </option>
          <option value="direct">
            Direct
          </option>
          <option value="consultative">
            Consultative
          </option>
        </select>

        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
        >
          {loading
            ? "Generating..."
            : "Generate"}
        </button>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-300">
          {error}
        </p>
      )}

      {message && (
        <div className="mt-4 whitespace-pre-wrap rounded-xl border border-white/10 bg-black p-4 text-sm leading-6 text-white/70">
          {message}
        </div>
      )}
    </div>
  );
}