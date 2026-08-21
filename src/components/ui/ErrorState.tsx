interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
      <p className="text-sm text-red-300">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg border border-red-400/20 px-3 py-2 text-xs text-red-200"
        >
          Try again
        </button>
      )}
    </div>
  );
}