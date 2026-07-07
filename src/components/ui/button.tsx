import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import Link from "next/link"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // rounded-lg per design framework; single focus-visible recipe (2px ring, 2px offset) sitewide
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // Framework: the primary CTA is the strong orange filled button.
        primary: "bg-accent-strong text-white hover:bg-accent-strong/90",
        // Teal filled button.
        secondary: "bg-primary text-white hover:bg-primary-dark",
        // Neutral outline, teal label.
        outline:
          "bg-white border border-border text-primary hover:border-primary hover:bg-slate-50",
        // Text-only, orange label with a tinted hover.
        ghost: "text-accent-strong hover:bg-accent-light",
        link: "text-accent-strong underline-offset-4 hover:underline",
        // --- Backward-compatible variants (existing consumers) ---
        default: "bg-primary text-white hover:bg-primary-dark",
        accent: "bg-accent-strong text-white hover:bg-accent-strong/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
        default: "px-6 py-3 text-sm",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  fullWidth = false,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    fullWidth?: boolean
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        buttonVariants({ variant, size }),
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  )
}

// ButtonLink wrapper for backward compatibility
function ButtonLink({
  href,
  className,
  variant = "default",
  size = "default",
  fullWidth = false,
  external = false,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Link>, 'href'> &
  VariantProps<typeof buttonVariants> & {
    href: string
    fullWidth?: boolean
    external?: boolean
  }) {
  const classes = cn(
    buttonVariants({ variant, size }),
    fullWidth && "w-full",
    className
  )

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...(props as any)}
      >
        {children}
      </a>
    )
  }

  return (
    <Link
      href={href}
      className={classes}
      {...props}
    >
      {children}
    </Link>
  )
}

export { Button, ButtonLink, buttonVariants }
