import * as React from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

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

function fileKind(href?: string, sizeLabel?: string) {
  const ext = href?.split(".").pop()?.toUpperCase();
  if (ext && ["PDF", "DOC", "DOCX", "XLS", "XLSX", "RTF"].includes(ext)) {
    return ext === "DOCX" ? "DOC" : ext === "XLSX" ? "XLS" : ext;
  }
  if (sizeLabel?.toLowerCase().includes("pdf")) return "PDF";
  return "ФАЙЛ";
}

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
  const kind = fileKind(href, sizeLabel);
  const meta = [date, sizeLabel].filter(Boolean).join(" · ");

  const inner = (
    <>
      <div
        className="mt-0.5 flex size-10 shrink-0 items-center justify-center border border-line bg-paper-muted font-sans text-[10px] font-semibold tracking-[0.06em] text-pine transition-colors duration-150 group-hover:border-brick group-hover:text-brick"
        aria-hidden
      >
        {kind}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium uppercase tracking-[0.08em]">
          {category ? <span className="text-muted">{category}</span> : null}
          {signed ? <span className="text-success">ЭП</span> : null}
          {!downloadable ? <span className="text-warning">Готовится</span> : null}
        </div>
        <p className="mt-1.5 font-sans text-[15px] font-medium leading-snug tracking-[-0.01em] text-ink transition-colors duration-150 group-hover:text-brick">
          {title}
        </p>
        {meta ? <p className="mt-1 text-[13px] text-graphite">{meta}</p> : null}
      </div>
      {downloadable && href ? (
        <span className="mt-1 inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-graphite transition-colors duration-150 group-hover:text-brick">
          <Download className="size-3.5" aria-hidden />
          <span className="hidden sm:inline">Открыть</span>
          <span className="sr-only sm:hidden">Открыть</span>
        </span>
      ) : null}
    </>
  );

  if (downloadable && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group flex items-start gap-4 border-b border-line py-4 no-underline transition-colors duration-150 last:border-b-0 hover:bg-surface/70",
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
        "group flex items-start gap-4 border-b border-line py-4 last:border-b-0",
        className,
      )}
    >
      {inner}
    </div>
  );
}

function DocumentTile({
  title,
  href,
  category,
  date,
  className,
}: DocumentCardProps) {
  const body = (
    <>
      {category ? (
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
          {category}
        </p>
      ) : null}
      <p className="mt-2 font-sans text-[15px] font-medium tracking-[-0.01em] text-ink">
        {title}
      </p>
      {date ? <p className="mt-1 text-sm text-graphite">{date}</p> : null}
    </>
  );

  if (!href) {
    return (
      <div className={cn("block border border-line bg-surface p-4", className)}>
        {body}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "block border border-line bg-surface p-4 no-underline transition-colors duration-150 hover:border-line-strong",
        className,
      )}
    >
      {body}
    </Link>
  );
}

export { DocumentRow, DocumentTile };
