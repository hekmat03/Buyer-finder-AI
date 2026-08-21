import type {
  QualificationResult,
} from "@/lib/qualification/types";

interface QualificationSummaryProps {
  qualification: QualificationResult;
}

export function QualificationSummary({
  qualification,
}: QualificationSummaryProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="text-lg font-semibold text-white">
        Qualification
      </h3>

      <p className="mt-3 text-sm leading-6 text-white/60">
        {qualification.summary}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Item
          label="Buying Intent"
          value={qualification.buyingIntent}
        />

        <Item
          label="Service Match"
          value={qualification.serviceMatch}
        />

        <Item
          label="Budget Evidence"
          value={qualification.budgetEvidence}
        />

        <Item
          label="Timeline"
          value={qualification.timeline}
        />

        <Item
          label="Contactability"
          value={qualification.contactability}
        />

        <Item
          label="Business Value"
          value={`${qualification.businessValue}/10`}
        />
      </div>

      {qualification.riskFlags.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-white/40">
            Risk Flags
          </p>

          <ul className="mt-2 space-y-1 text-sm text-red-300">
            {qualification.riskFlags.map(
              (flag, index) => (
                <li key={`${flag}-${index}`}>
                  • {flag}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function Item({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 p-3">
      <p className="text-xs text-white/40">
        {label}
      </p>

      <p className="mt-1 text-sm text-white">
        {value}
      </p>
    </div>
  );
}