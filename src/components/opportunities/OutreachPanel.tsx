"use client";

import type { QualificationResult } from "@/lib/qualification/types";

import {
  OutreachGenerator,
} from "./OutreachGenerator";

interface OutreachPanelProps {
  content: string;
  qualification: QualificationResult;
}

export function OutreachPanel({
  content,
  qualification,
}: OutreachPanelProps) {
  return (
    <section className="mt-6">
      <OutreachGenerator
        content={content}
        qualification={qualification}
      />
    </section>
  );
}