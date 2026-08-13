import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Buttons — канцелярская строгость.
 * radius 4px, один brick primary, без pill и glow.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-[15px] font-medium tracking-[-0.01em] transition-[color,background-color,border-color,transform] duration-150 ease-out disabled:pointer-events-none disabled:opacity-45 active:translate-y-px [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-brick text-white hover:bg-brick-hover focus-visible:outline-brick",
        secondary:
          "border border-ink/80 bg-transparent text-ink hover:bg-paper-muted",
        ghost:
          "bg-transparent text-ink hover:bg-paper-muted",
        link:
          "h-auto rounded-none bg-transparent px-0 text-brick underline-offset-4 hover:underline",
        soft:
          "bg-brick-tint text-brick hover:bg-brick hover:text-white",
      },
      size: {
        sm: "h-9 rounded-[var(--radius-sm)] px-3.5 text-sm",
        md: "h-11 rounded-[var(--radius-sm)] px-5",
        lg: "h-12 rounded-[var(--radius-sm)] px-6 text-base",
        icon: "size-10 rounded-[var(--radius-sm)] sm:size-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
