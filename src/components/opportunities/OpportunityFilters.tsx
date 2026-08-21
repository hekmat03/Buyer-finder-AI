"use client";

import type { SupportedService } from "@/lib/discovery/service-match";

export type OpportunityFilterState = {
  service: SupportedService | "ALL";
  classification: string;
  minScore: number;
};

interface OpportunityFiltersProps {
  filters: OpportunityFilterState;
  onChange: (
    filters: OpportunityFilterState
  ) => void;
}

const SERVICES: SupportedService[] = [
  "Web Development",
  "AI Agent",
  "AI Chatbot",
  "AI Automation",
  "SaaS Development",
  "Custom Software",
];

export function OpportunityFilters({
  filters,
  onChange,
}: OpportunityFiltersProps) {
  return (
    <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:grid-cols-3">
      <div>
        <label className="mb-2 block text-xs font-medium text-white/50">
          Service
        </label>

        <select
          value={filters.service}
          onChange={(event) =>
            onChange({
              ...filters,
              service:
                event.target.value as
                  | SupportedService
                  | "ALL",
            })
          }
          className="w-full rounded-xl border border-white/10 bg-black px-3 py-2.5 text-sm text-white outline-none"
        >
          <option value="ALL">
            All Services
          </option>

          {SERVICES.map((service) => (
            <option
              key={service}
              value={service}
            >
              {service}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-white/50">
          Classification
        </label>

        <select
          value={filters.classification}
          onChange={(event) =>
            onChange({
              ...filters,
              classification:
                event.target.value,
            })
          }
          className="w-full rounded-xl border border-white/10 bg-black px-3 py-2.5 text-sm text-white outline-none"
        >
          <option value="ALL">
            All
          </option>
          <option value="EXCEPTIONAL">
            Exceptional
          </option>
          <option value="HOT">
            Hot
          </option>
          <option value="STRONG">
            Strong
          </option>
          <option value="POTENTIAL">
            Potential
          </option>
          <option value="WEAK">
            Weak
          </option>
          <option value="LOW_PRIORITY">
            Low Priority
          </option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-white/50">
          Minimum Score
        </label>

        <select
          value={filters.minScore}
          onChange={(event) =>
            onChange({
              ...filters,
              minScore: Number(
                event.target.value
              ),
            })
          }
          className="w-full rounded-xl border border-white/10 bg-black px-3 py-2.5 text-sm text-white outline-none"
        >
          <option value="0">
            Any Score
          </option>
          <option value="40">
            40+
          </option>
          <option value="60">
            60+
          </option>
          <option value="70">
            70+
          </option>
          <option value="80">
            80+
          </option>
          <option value="90">
            90+
          </option>
        </select>
      </div>
    </div>
  );
}