"use client";

import {
  useState,
} from "react";

import type {
  SupportedService,
} from "@/lib/discovery/service-match";

interface DiscoveryRunnerProps {
  onComplete?: () => void;
}

const SERVICES: SupportedService[] = [
  "Web Development",
  "AI Agent",
  "AI Chatbot",
  "AI Automation",
  "SaaS Development",
  "Custom Software",
];

export function DiscoveryRunner({
  onComplete,
}: DiscoveryRunnerProps) {
  const [service, setService] =
    useState<SupportedService>(
      "Web Development"
    );

  const [keywords, setKeywords] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  async function runDiscovery() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "/api/discovery",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            service,
            keywords: keywords
              .split(",")
              .map((item) =>
                item.trim()
              )
              .filter(Boolean),
            limit: 50,
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

      setMessage(
        `Found ${data.summary?.discovered ?? 0} opportunities.`
      );

      onComplete?.();
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs text-white/50">
            Service
          </label>

          <select
            value={service}
            onChange={(event) =>
              setService(
                event.target.value as SupportedService
              )
            }
            className="w-full rounded-xl border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
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
          <label className="mb-2 block text-xs text-white/50">
            Keywords
          </label>

          <input
            value={keywords}
            onChange={(event) =>
              setKeywords(
                event.target.value
              )
            }
            placeholder="developer, website, chatbot"
            className="w-full rounded-xl border border-white/10 bg-black px-3 py-2.5 text-sm text-white outline-none"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={runDiscovery}
        disabled={loading}
        className="mt-4 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
      >
        {loading
          ? "Searching..."
          : "Find Opportunities"}
      </button>

      {message && (
        <p className="mt-3 text-sm text-emerald-300">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}