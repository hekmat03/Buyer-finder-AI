"use client";

import {
  useState,
} from "react";

import {
  DashboardHeader,
} from "./DashboardHeader";

import {
  DashboardStats,
} from "./DashboardStats";

import {
  DiscoveryForm,
} from "@/components/discovery/DiscoveryForm";

import {
  DiscoveryResults,
} from "@/components/discovery/DiscoveryResults";

export function DashboardClient() {
  const [
    refreshKey,
    setRefreshKey,
  ] = useState(0);

  function refreshDashboard() {
    setRefreshKey(
      (value) => value + 1
    );
  }

  return (
    <>
      <DashboardHeader
        onRefresh={
          refreshDashboard
        }
      />

      <DashboardStats />

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">
            Find New Buyers
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Search public sources for active
            commercial opportunities.
          </p>
        </div>

        <DiscoveryForm
          onComplete={
            refreshDashboard
          }
        />
      </section>

      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">
            Opportunities
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Your highest-value opportunities
            appear here.
          </p>
        </div>

        <DiscoveryResults
          refreshKey={
            refreshKey
          }
        />
      </section>
    </>
  );
}