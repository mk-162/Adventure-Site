import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import Link from "next/link"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-dark focus:ring-primary",
        primary: "bg-primary text-white hover:bg-primary-dark focus:ring-primary",
        accent: "bg-accent-hover text-white hover:bg-accent-hover/90 focus:ring-accent-hover",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-gray-200 text-gray-700 hover:border-accent-hover hover:text-accent-hover focus:ring-accent-hover",
        secondary:
          "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300",
        ghost:
          "text-gray-600 hover:text-primary hover:bg-gray-100 focus:ring-gray-300",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-6 py-3 text-sm",
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
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
