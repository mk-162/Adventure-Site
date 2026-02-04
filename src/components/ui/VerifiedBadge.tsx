import { Shield, ShieldCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type ClaimStatus = "stub" | "claimed" | "premium";
export type BadgeSize = "sm" | "md" | "lg";

interface VerifiedBadgeProps {
  claimStatus: ClaimStatus;
  size?: BadgeSize;
  showLabel?: boolean;
  className?: string;
}

export function VerifiedBadge({
  claimStatus,
  size = "md",
  showLabel = true,
  className,
}: VerifiedBadgeProps) {
  // Don't render anything for stub operators
  if (claimStatus === "stub") {
    return null;
  }

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
      container: "h-8 gap-2 px-4 py-1.5",
      icon: "w-5 h-5",
      text: "text-sm",
      check: "w-3 h-3",
    },
  };

  // Color schemes
  const colors = isPremium
    ? {
        bg: "bg-gradient-to-r from-[#f97316]/10 to-amber-500/10",
        border: "border-[#f97316]/30",
        text: "text-[#f97316]",
        icon: "text-[#f97316]",
        shadow: "shadow-[#f97316]/5",
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
          {isPremium ? "PREMIUM VERIFIED PARTNER" : "INDEPENDENT VERIFIED OPERATOR"}
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
    </div>
  );
}

// Convenience exports
export function VerifiedBadgeSm({ claimStatus }: { claimStatus: ClaimStatus }) {
  return <VerifiedBadge claimStatus={claimStatus} size="sm" showLabel={false} />;
}

export function VerifiedBadgeMd({ claimStatus }: { claimStatus: ClaimStatus }) {
  return <VerifiedBadge claimStatus={claimStatus} size="md" />;
}

export function VerifiedBadgeLg({ claimStatus }: { claimStatus: ClaimStatus }) {
  return <VerifiedBadge claimStatus={claimStatus} size="lg" />;
}
