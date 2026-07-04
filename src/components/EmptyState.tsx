/**
 * Empty state ramah dengan ilustrasi SVG sederhana.
 */
import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="border border-dashed border-border rounded-[var(--gp-radius)] p-8 text-center bg-background/50">
      <div className="mx-auto mb-3 size-14 grid place-items-center rounded-full bg-accent text-[var(--gp-primary)]">
        {icon ?? (
          <svg viewBox="0 0 24 24" fill="none" className="size-7" stroke="currentColor" strokeWidth="1.6">
            <path d="M4 6h16M4 12h10M4 18h7" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div className="font-medium">{title}</div>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
