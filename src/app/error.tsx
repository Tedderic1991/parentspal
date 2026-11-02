"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-xl space-y-5 p-8">
      <h1>We couldn&apos;t load ParentsPal.</h1>
      <p>Try again. If Supabase mode is enabled, check the server configuration and migrations.</p>
      <button className="rounded-xl bg-ink px-5 py-3 text-white" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
