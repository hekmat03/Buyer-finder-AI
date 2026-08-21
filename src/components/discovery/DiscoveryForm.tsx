"use client";

import {
  useState,
} from "react";

import type {
  SupportedService,
} from "@/lib/discovery/service-match";

const SERVICES: SupportedService[] = [
  "Web Development",
  "AI Agent",
  "AI Chatbot",
  "AI Automation",
  "SaaS Development",
  "Custom Software",
];

interface DiscoveryFormProps {
  onComplete?: (
    result: unknown
  ) => void;
}

export function DiscoveryForm({
  onComplete,
}: DiscoveryFormProps) {
  const [service, setService] =
    useState<SupportedService>(
      "Web Development"
    );

  const [keywords, setKeywords] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/discover",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              service,
              keywords:
                keywords
                  .split(",")
                  .map(
                    (item) =>
                      item.trim()
                  )
                  .filter(Boolean),
              limit: 25,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Discovery failed."
        );
      }

      onComplete?.(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Discovery failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Service
          </label>

          <select
            value={service}
            onChange={(event) =>
              setService(
                event.target.value as SupportedService
              )
            }
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30"
          >
            {SERVICES.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Keywords
          </label>

          <input
            value={keywords}
            onChange={(event) =>
              setKeywords(
                event.target.value
              )
            }
            placeholder="roofing, chatbot, website"
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Finding opportunities..."
          : "Find Buyers"}
      </button>
    </form>
  );
}