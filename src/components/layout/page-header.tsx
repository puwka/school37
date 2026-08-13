import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  breadcrumbs,
  className,
  hideTitle = false,
}: {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  className?: string;
  hideTitle?: boolean;
}) {
  return (
    <header className={cn("mb-8 min-w-0", className)}>
      <Breadcrumbs items={breadcrumbs} className="mb-4" />
      {hideTitle ? null : (
        <h1 className="break-words font-serif text-[clamp(1.85rem,3.4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
          {title}
        </h1>
      )}
      {description ? (
        <p className="lead mt-4 max-w-prose">{description}</p>
      ) : null}
    </header>
  );
}
