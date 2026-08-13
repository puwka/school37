import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Несколько типов «карточек» — не один шаблон на весь сайт.
 * - surface: белая панель с рамкой (служебные блоки)
 * - panel: без рамки, только фон paper-muted
 * - accent: brick bar слева (важные объявления)
 * - plain: без контейнера, только отступы
 */
const cardVariants = cva("font-sans text-ink", {
  variants: {
    variant: {
      surface:
        "rounded-[var(--radius-md)] border border-line bg-surface p-6",
      panel: "rounded-[var(--radius-md)] bg-paper-muted p-6",
      accent: "accent-bar border border-line border-l-0 bg-surface py-4 pl-5 pr-6",
      plain: "p-0",
    },
  },
  defaultVariants: {
    variant: "surface",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-serif text-xl font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("mt-1 text-[15px] text-graphite", className)} {...props} />
  );
}

export { Card, CardTitle, CardDescription, cardVariants };
