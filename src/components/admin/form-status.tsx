"use client";

export function FormStatus({
  status,
  error,
}: {
  status?: string | null;
  error?: string | null;
}) {
  if (!status && !error) return null;
  return (
    <div
      className={
        error
          ? "rounded-[var(--radius-md)] border border-brick bg-brick-tint px-4 py-3 text-sm text-brick"
          : "rounded-[var(--radius-md)] border border-line bg-surface px-4 py-3 text-sm text-graphite"
      }
      role={error ? "alert" : "status"}
    >
      {error ?? status}
    </div>
  );
}
