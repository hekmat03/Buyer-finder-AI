import type { OpportunityRecord } from "./types";

export interface OpportunityStats {
  total: number;
  exceptional: number;
  hot: number;
  strong: number;
  potential: number;
  averageScore: number;
  highIntent: number;
}

export function calculateOpportunityStats(
  opportunities: OpportunityRecord[]
): OpportunityStats {
  const total = opportunities.length;

  if (total === 0) {
    return {
      total: 0,
      exceptional: 0,
      hot: 0,
      strong: 0,
      potential: 0,
      averageScore: 0,
      highIntent: 0,
    };
  }

  const scoreTotal = opportunities.reduce(
    (sum, item) => sum + item.score,
    0
  );

  return {
    total,

    exceptional: opportunities.filter(
      (item) =>
        item.classification === "EXCEPTIONAL"
    ).length,

    hot: opportunities.filter(
      (item) =>
        item.classification === "HOT"
    ).length,

    strong: opportunities.filter(
      (item) =>
        item.classification === "STRONG"
    ).length,

    potential: opportunities.filter(
      (item) =>
        item.classification === "POTENTIAL"
    ).length,

    averageScore: Math.round(
      scoreTotal / total
    ),

    highIntent: opportunities.filter(
      (item) =>
        item.buyingIntent === "VERY_HIGH" ||
        item.buyingIntent === "HIGH"
    ).length,
  };
}