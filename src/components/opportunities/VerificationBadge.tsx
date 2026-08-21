interface VerificationBadgeProps {
  status:
    | "VERIFIED"
    | "UNVERIFIED"
    | "FAILED";
}

export function VerificationBadge({
  status,
}: VerificationBadgeProps) {
  const label =
    status === "VERIFIED"
      ? "Verified"
      : status === "FAILED"
        ? "Verification Failed"
        : "Unverified";

  return (
    <span className="inline-flex rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/60">
      {label}
    </span>
  );
}