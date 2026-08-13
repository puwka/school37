import Link from "next/link";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { getMenuTree } from "@/server/queries";
import { cn } from "@/lib/utils";

function TwoColLayout({
  title,
  items,
  currentPath,
  children,
  className,
}: {
  title: string;
  items: { label: string; href: string; children?: { label: string; href: string }[] }[];
  currentPath: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "container-site grid gap-8 py-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 lg:py-10",
        className,
      )}
    >
      <aside aria-label={title}>
        <SidebarNav
          title={title}
          items={items}
          currentPath={currentPath}
          className="min-w-0 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start"
        />
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}

export async function SvedeniyaLayout({
  children,
  currentPath,
  className,
}: {
  children: React.ReactNode;
  currentPath: string;
  className?: string;
}) {
  const items = await getMenuTree("svedeniya");
  return (
    <TwoColLayout
      title="Сведения об ОО"
      items={items}
      currentPath={currentPath}
      className={className}
    >
      {children}
    </TwoColLayout>
  );
}

export async function RoditelyamLayout({
  children,
  currentPath,
  className,
}: {
  children: React.ReactNode;
  currentPath: string;
  className?: string;
}) {
  const items = await getMenuTree("roditelyam");
  return (
    <TwoColLayout
      title="Родителям"
      items={items}
      currentPath={currentPath}
      className={className}
    >
      {children}
    </TwoColLayout>
  );
}

export async function PedagogamLayout({
  children,
  currentPath,
  className,
}: {
  children: React.ReactNode;
  currentPath: string;
  className?: string;
}) {
  const items = await getMenuTree("pedagogam");
  return (
    <TwoColLayout
      title="Педагогам"
      items={items}
      currentPath={currentPath}
      className={className}
    >
      {children}
    </TwoColLayout>
  );
}

export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-prose space-y-4 text-[17px] leading-relaxed text-ink [&_a]:text-brick [&_a]:underline [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  num,
  className,
}: {
  children: React.ReactNode;
  num?: string;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-serif text-2xl font-semibold text-ink",
        num && "section-num",
        className,
      )}
      data-num={num}
    >
      {children}
    </h2>
  );
}

export function TextLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className = "font-medium text-brick no-underline hover:underline";
  if (external) {
    return (
      <a
        href={href}
        className={className}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
