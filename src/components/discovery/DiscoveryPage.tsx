"use client";

import {
  useState,
} from "react";

import {
  DiscoveryRunner,
} from "./DiscoveryRunner";

import {
  DiscoveryResults,
} from "./DiscoveryResults";

export function DiscoveryPage() {
  const [refreshKey, setRefreshKey] =
    useState(0);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      <div>
        <p className="text-sm font-medium text-white/40">
          BuyerFinder AI
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          Buyer Discovery
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
          Discover recent public opportunities,
          qualify buying intent, score prospects,
          and prepare honest outreach.
        </p>
      </div>

      <DiscoveryRunner
        onComplete={() =>
          setRefreshKey(
            (value) => value + 1
          )
        }
      />

      <DiscoveryResults
        refreshKey={refreshKey}
      />
    </main>
  );
}