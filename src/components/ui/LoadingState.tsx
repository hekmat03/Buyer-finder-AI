interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <div className="flex min-h-32 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="text-sm text-white/50">
        {message}
      </div>
    </div>
  );
}