import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type Props = Omit<ImageProps, "alt"> & {
  alt: string;
  className?: string;
};

/**
 * Обёртка next/image с lazy по умолчанию и обязательным alt.
 */
export function OptimizedImage({
  alt,
  className,
  loading,
  priority,
  sizes = "(max-width: 768px) 100vw, 720px",
  ...props
}: Props) {
  return (
    <Image
      alt={alt}
      className={cn(className)}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : (loading ?? "lazy")}
      {...props}
    />
  );
}
