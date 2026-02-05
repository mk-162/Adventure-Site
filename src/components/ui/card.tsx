import { ReactNode } from "react";
import { clsx } from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  className,
  hover = false,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={clsx(
        "bg-white rounded-2xl shadow-sm",
        hover && "hover:shadow-lg transition-shadow cursor-pointer",
        padding === "sm" && "p-3",
        padding === "md" && "p-4",
        padding === "lg" && "p-6",
        padding === "none" && "",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: boolean;
  children?: ReactNode;
}

export function CardImage({
  src,
  alt,
  className,
  overlay = false,
  children,
}: CardImageProps) {
  return (
    <div className={clsx("relative overflow-hidden", className)}>
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url('${src}')` }}
        role="img"
        aria-label={alt}
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      )}
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={clsx("p-4", className)}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: "h2" | "h3" | "h4";
}

export function CardTitle({
  children,
  className,
  as: Component = "h3",
}: CardTitleProps) {
  return (
    <Component
      className={clsx(
        "font-bold text-primary group-hover:text-accent-hover transition-colors",
        className
      )}
    >
      {children}
    </Component>
  );
}
