import * as React from "react";
import Link from "next/link";
import { FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type DocumentCardProps = {
  title: string;
  href?: string;
  downloadable?: boolean;
  category?: string;
  date?: string;
  sizeLabel?: string;
  signed?: boolean;
  className?: string;
};

/**
 * Строка реестра документов — не плитка с обложкой.
 * Сканирование длинных списков важнее «карточного» вида.
 */
function DocumentRow({
  title,
  href,
  downloadable = true,
  category,
  date,
  sizeLabel,
  signed,
  className,
}: DocumentCardProps) {
  const meta = [date, sizeLabel].filter(Boolean).join(" · ");
  const inner = (
    <>
      <FileText
        className="mt-0.5 size-5 shrink-0 text-graphite group-hover:text-brick"
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {category ? <Badge variant="outline">{category}</Badge> : null}
          {signed ? <Badge variant="success">ЭП</Badge> : null}
          {!downloadable ? (
            <Badge variant="default">Файл готовится</Badge>
          ) : null}
        </div>
        <p className="mt-1 font-sans text-[15px] font-medium text-ink group-hover:text-brick">
          {title}
        </p>
        {meta ? <p className="mt-0.5 text-sm text-graphite">{meta}</p> : null}
      </div>
      {downloadable && href ? (
        <span className="mt-1 inline-flex shrink-0 items-center gap-1 text-sm text-graphite group-hover:text-brick">
          <Download className="size-3.5" aria-hidden />
          <span className="hidden sm:inline">Скачать</span>
          <span className="sr-only sm:hidden">Скачать</span>
        </span>
      ) : null}
    </>
  );

  if (downloadable && href) {
    return (
      <a
        href={href}
        download
        className={cn(
          "group flex items-start gap-3 border-b border-line py-3.5 no-underline transition-colors last:border-b-0 hover:bg-paper-muted/60",
          className,
        )}
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      className={cn(
        "group flex items-start gap-3 border-b border-line py-3.5 last:border-b-0",
        className,
      )}
    >
      {inner}
    </div>
  );
}

/**
 * Компактная карточка документа для боковых блоков (не для реестра).
 */
function DocumentTile({
  title,
  href,
  category,
  date,
  className,
}: DocumentCardProps) {
  const body = (
    <>
      {category ? <Badge variant="default">{category}</Badge> : null}
      <p className="mt-2 font-sans text-[15px] font-medium text-ink">{title}</p>
      {date ? <p className="mt-1 text-sm text-graphite">{date}</p> : null}
    </>
  );

  if (!href) {
    return (
      <div
        className={cn(
          "block rounded-[var(--radius-md)] border border-line bg-surface p-4",
          className,
        )}
      >
        {body}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "block rounded-[var(--radius-md)] border border-line bg-surface p-4 no-underline transition-colors hover:border-line-strong",
        className,
      )}
    >
      {body}
    </Link>
  );
}

export { DocumentRow, DocumentTile };
