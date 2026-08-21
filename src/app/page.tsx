export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-start gap-4 px-6 py-24">
      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
        Phase 1 — Foundation
      </span>
      <h1 className="text-3xl font-semibold tracking-tight">
        BuyerFinder AI
      </h1>
      <p className="text-slate-600">
        Foundation is scaffolded: Next.js, TypeScript, Tailwind, and the
        Supabase client are wired up. The opportunity dashboard lands in
        Phase 6, once the database, source, and scoring pipelines are in
        place.
      </p>
    </main>
  );
}
