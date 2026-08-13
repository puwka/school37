import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Badges — метки категорий (НОВОСТЬ, ДОКУМЕНТ), не pill-chips SaaS.
 * uppercase, letter-spacing, radius 4px, без rounded-full.
 */
const badgeVariants = cva(
  "inline-flex items-center font-sans text-[11px] font-medium uppercase tracking-[0.06em]",
  {
    variants: {
      variant: {
        default: "bg-paper-muted text-graphite",
        brick: "bg-brick-tint text-brick",
        outline: "border border-line text-graphite",
        success: "bg-success-tint text-success",
        warning: "bg-warning-tint text-warning",
      },
      size: {
        sm: "rounded-[var(--radius-sm)] px-1.5 py-0.5",
        md: "rounded-[var(--radius-sm)] px-2 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
