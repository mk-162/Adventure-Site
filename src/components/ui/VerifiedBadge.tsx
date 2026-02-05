import { Shield, ShieldCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type ClaimStatus = "stub" | "claimed" | "premium";
export type BadgeSize = "sm" | "md" | "lg";

interface VerifiedBadgeProps {
  claimStatus: ClaimStatus; // or the effective tier
  isTrial?: boolean;
  size?: BadgeSize;
  showLabel?: boolean;
  className?: string;
}

export function VerifiedBadge({
  claimStatus,
  isTrial,
  size = "md",
  showLabel = true,
  className,
}: VerifiedBadgeProps) {
  // Don't render anything for stub operators (unless it's a trial which effectively makes it premium)
  if (claimStatus === "stub" && !isTrial) {
    return null;
  }

  // Treat as premium if it says premium OR if it's a trial (which upgrades to premium)
  // Caller should pass effective tier as claimStatus, but we can double check
  const isPremium = claimStatus === "premium";

  // Size-specific styles
  const sizeClasses = {
    sm: {
      container: "h-5 gap-1 px-2 py-0.5",
      icon: "w-3 h-3",
      text: "text-[10px]",
      check: "w-2 h-2",
    },
    md: {
      container: "h-6 gap-1.5 px-2.5 py-1",
      icon: "w-4 h-4",
      text: "text-xs",
      check: "w-2.5 h-2.5",
    },
    lg: {
      container: "h-7 gap-1.5 px-3 py-1",
      icon: "w-4 h-4",
      text: "text-xs",
      check: "w-2.5 h-2.5",
    },
  };

  // Color schemes
  const colors = isPremium
    ? {
        bg: "bg-gradient-to-r from-accent-hover/10 to-amber-500/10",
        border: "border-accent-hover/30",
        text: "text-accent-hover",
        icon: "text-accent-hover",
        shadow: "shadow-accent-hover/5",
      }
    : {
        bg: "bg-gradient-to-r from-emerald-50 to-green-50",
        border: "border-emerald-500/30",
        text: "text-emerald-700",
        icon: "text-emerald-600",
        shadow: "shadow-emerald-500/5",
      };

  // Text labels based on size
  const getLabel = () => {
    if (!showLabel || size === "sm") return null;
    
    if (size === "lg") {
      return (
        <span className={cn("font-bold tracking-tight whitespace-nowrap", colors.text, sizeClasses[size].text)}>
          {isPremium ? "Premium Partner" : "Verified Partner"}
        </span>
      );
    }
    
    // MD size
    return (
      <span className={cn("font-bold whitespace-nowrap", colors.text, sizeClasses[size].text)}>
        {isPremium ? "Premium Partner" : "Verified"}
      </span>
    );
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border backdrop-blur-sm transition-all",
        colors.bg,
        colors.border,
        colors.shadow,
        sizeClasses[size].container,
        "shadow-sm",
        className
      )}
      title={isPremium ? "Premium Verified Partner" : "Independent Verified Operator"}
    >
      {/* Shield Icon with Checkmark */}
      <div className="relative flex items-center justify-center">
        <ShieldCheck
          className={cn(
            colors.icon,
            sizeClasses[size].icon,
            "drop-shadow-sm"
          )}
          strokeWidth={2.5}
        />
      </div>

      {/* Label */}
      {getLabel()}

      {/* Premium Star (only for premium, only for MD and LG) */}
      {isPremium && size !== "sm" && (
        <Star
          className={cn(
            colors.icon,
            sizeClasses[size].check,
            "fill-current opacity-80"
          )}
        />
      )}

      {isTrial && (
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
        </span>
      )}
      {isTrial && showLabel && size !== 'sm' && (
          <span className="ml-1 text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded-full border border-sky-200">
              Trial
          </span>
      )}
    </div>
  );
}

// Convenience exports
export function VerifiedBadgeSm({ claimStatus, isTrial }: { claimStatus: ClaimStatus; isTrial?: boolean }) {
  return <VerifiedBadge claimStatus={claimStatus} isTrial={isTrial} size="sm" showLabel={false} />;
}

export function VerifiedBadgeMd({ claimStatus, isTrial }: { claimStatus: ClaimStatus; isTrial?: boolean }) {
  return <VerifiedBadge claimStatus={claimStatus} isTrial={isTrial} size="md" />;
}

export function VerifiedBadgeLg({ claimStatus, isTrial }: { claimStatus: ClaimStatus; isTrial?: boolean }) {
  return <VerifiedBadge claimStatus={claimStatus} isTrial={isTrial} size="lg" />;
}
