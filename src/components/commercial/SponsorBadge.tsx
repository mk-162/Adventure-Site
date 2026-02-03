import Link from "next/link";
import Image from "next/image";

interface SponsorBadgeProps {
  operatorName: string;
  operatorSlug: string;
  operatorLogo?: string;
  className?: string;
}

export function SponsorBadge({
  operatorName,
  operatorSlug,
  operatorLogo,
  className,
}: SponsorBadgeProps) {
  return (
    <Link
      href={`/directory/${operatorSlug}`}
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-sm text-gray-600 transition-colors ${className}`}
    >
      {operatorLogo ? (
        <Image
          src={operatorLogo}
          alt={operatorName}
          width={20}
          height={20}
          className="rounded-full object-cover"
        />
      ) : (
        <span className="w-5 h-5 bg-[#f97316] rounded-full flex items-center justify-center text-white text-xs font-bold">
          {operatorName.charAt(0)}
        </span>
      )}
      <span>
        Sponsored by <span className="font-medium">{operatorName}</span>
      </span>
    </Link>
  );
}
