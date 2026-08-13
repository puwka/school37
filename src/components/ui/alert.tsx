import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "flex gap-3 rounded-[var(--radius-md)] border px-4 py-3.5 font-sans text-[15px]",
  {
    variants: {
      variant: {
        info: "border-line bg-surface text-ink",
        success: "border-success/25 bg-success-tint text-ink",
        warning: "border-warning/30 bg-warning-tint text-ink",
        danger: "accent-bar border-brick/20 border-l-0 bg-brick-tint text-ink",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: AlertCircle,
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
}

function Alert({
  className,
  variant = "info",
  title,
  children,
  ...props
}: AlertProps) {
  const Icon = icons[variant ?? "info"];
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon
        className={cn(
          "mt-0.5 size-4 shrink-0",
          variant === "success" && "text-success",
          variant === "warning" && "text-warning",
          variant === "danger" && "text-brick",
          variant === "info" && "text-graphite",
        )}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        {title ? (
          <p className="mb-0.5 font-medium text-ink">{title}</p>
        ) : null}
        <div className="text-graphite [&_a]:text-brick [&_a]:underline">{children}</div>
      </div>
    </div>
  );
}

export { Alert, alertVariants };
