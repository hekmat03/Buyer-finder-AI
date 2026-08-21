"use client";

import {
  useState,
} from "react";

import {
  DiscoveryForm,
} from "@/components/discovery/DiscoveryForm";

import {
  DiscoveryResults,
} from "@/components/discovery/DiscoveryResults";

export default function DashboardPage() {
  const [
    refreshKey,
    setRefreshKey,
  ] = useState(0);

  function handleComplete() {
    setRefreshKey(
      (value) => value + 1
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-medium text-white/40">
            BUYERFINDER AI
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Buyer Discovery
          </h1>

          <p className="mt-3 max-w-2xl text-white/50">
            Find real public opportunities,
            qualify buyer intent, and rank the
            best prospects.
          </p>
        </div>

        <DiscoveryForm
          onComplete={
            handleComplete
          }
        />

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Opportunities
            </h2>

            <p className="mt-1 text-sm text-white/40">
              Highest-scoring opportunities
              appear first.
            </p>
          </div>

          <DiscoveryResults
            refreshKey={
              refreshKey
            }
          />
        </section>
      </div>
    </main>
  );
}