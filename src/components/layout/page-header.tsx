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
        <h1 className="break-words font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-tight text-ink">
          {title}
        </h1>
      )}
      {description ? (
        <p className="mt-3 max-w-prose text-[17px] text-graphite">{description}</p>
      ) : null}
    </header>
  );
}
