import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, hint, error, id, ...props }, ref) => {
    const inputId = id ?? React.useId();
    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label
            htmlFor={inputId}
            className="font-sans text-sm font-medium text-ink"
          >
            {label}
          </label>
        ) : null}
        <input
          id={inputId}
          type={type}
          className={cn(
            "h-11 w-full rounded-[var(--radius-md)] border border-line bg-surface px-3 font-sans text-[15px] text-ink placeholder:text-muted",
            "transition-colors duration-150",
            "hover:border-line-strong",
            "focus-visible:border-brick focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brick",
            "disabled:cursor-not-allowed disabled:bg-paper-muted disabled:opacity-60",
            error && "border-brick focus-visible:ring-brick",
            className,
          )}
          ref={ref}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className="text-sm text-brick">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-sm text-graphite">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
