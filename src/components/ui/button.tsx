import { clsx } from "clsx";
import Link from "next/link";
import { ReactNode } from "react";

interface ButtonBaseProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

interface ButtonProps extends ButtonBaseProps {
  type?: "button" | "submit";
  onClick?: () => void;
}

interface ButtonLinkProps extends ButtonBaseProps {
  href: string;
  external?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

const variants = {
  primary: "bg-[#1e3a4c] text-white hover:bg-[#152a38] focus:ring-[#1e3a4c]",
  secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300",
  accent: "bg-[#ea580c] text-white hover:bg-[#ea580c] focus:ring-[#ea580c]",
  outline:
    "border border-gray-200 text-gray-700 hover:border-[#ea580c] hover:text-[#ea580c] focus:ring-[#ea580c]",
  ghost: "text-gray-600 hover:text-[#1e3a4c] hover:bg-gray-100 focus:ring-gray-300",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  disabled = false,
  type = "button",
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  href,
  external = false,
}: ButtonLinkProps) {
  const classes = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
