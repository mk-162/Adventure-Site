import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
        accent: "bg-[#ea580c] text-white [a&]:hover:bg-[#c2410c]",
      },
      size: {
        default: "px-2 py-0.5 text-xs",
        sm: "px-1.5 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

// Custom badge components for backward compatibility
function DurationBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="default" className="bg-primary text-white">
      {children}
    </Badge>
  );
}

function DifficultyBadge({
  level,
}: {
  level: "easy" | "moderate" | "difficult" | "advanced" | string;
}) {
  const getVariant = () => {
    const normalized = level.toLowerCase();
    if (normalized === "easy" || normalized === "beginner") {
      return "bg-green-100 text-green-700";
    }
    if (normalized === "moderate" || normalized === "intermediate") {
      return "bg-amber-100 text-amber-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  return (
    <Badge className={getVariant()}>
      {level}
    </Badge>
  );
}

function PriceBadge({ from, to }: { from?: number | null; to?: number | null }) {
  if (!from && !to) return null;

  const display = to && to !== from ? `£${from}-${to}` : `£${from}`;

  return (
    <span className="text-sm font-semibold text-primary">
      From {display}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <Badge variant="outline">
      {type}
    </Badge>
  );
}

export { Badge, badgeVariants, DurationBadge, DifficultyBadge, PriceBadge, TypeBadge }
