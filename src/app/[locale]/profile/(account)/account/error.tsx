"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h1>Une erreur est survenue</h1>
      <button onClick={reset}>Réessayer</button>
    </div>
  );
}
