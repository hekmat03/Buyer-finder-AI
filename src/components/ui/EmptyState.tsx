interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
      <h3 className="text-sm font-semibold text-white">
        {title}
      </h3>

      {description && (
        <p className="mt-2 text-sm text-white/40">
          {description}
        </p>
      )}
    </div>
  );
}