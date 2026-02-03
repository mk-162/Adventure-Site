import { clsx } from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "accent" | "success" | "warning" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center font-semibold rounded-full",
        // Size
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
        // Variants
        variant === "default" && "bg-gray-100 text-gray-700",
        variant === "primary" && "bg-[#1e3a4c] text-white",
        variant === "accent" && "bg-[#f97316] text-white",
        variant === "success" && "bg-green-100 text-green-700",
        variant === "warning" && "bg-amber-100 text-amber-700",
        variant === "outline" && "border border-gray-200 text-gray-600",
        className
      )}
    >
      {children}
    </span>
  );
}

// Pre-styled badges for common use cases
export function DurationBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="primary" size="sm">
      {children}
    </Badge>
  );
}

export function DifficultyBadge({
  level,
}: {
  level: "easy" | "moderate" | "difficult" | "advanced" | string;
}) {
  const variant =
    level === "easy" || level === "beginner"
      ? "success"
      : level === "moderate" || level === "intermediate"
      ? "warning"
      : "default";

  return (
    <Badge variant={variant} size="sm">
      {level}
    </Badge>
  );
}

export function PriceBadge({ from, to }: { from?: number | null; to?: number | null }) {
  if (!from && !to) return null;

  const display = to && to !== from ? `£${from}-${to}` : `£${from}`;

  return (
    <span className="text-sm font-semibold text-[#1e3a4c]">
      From {display}
    </span>
  );
}

export function TypeBadge({ type }: { type: string }) {
  return (
    <Badge variant="outline" size="sm">
      {type}
    </Badge>
  );
}
