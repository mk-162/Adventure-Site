import { clsx } from "clsx";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={clsx("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
      {/* Image placeholder */}
      <Skeleton className="h-48 w-full rounded-none" />
      
      {/* Content placeholder */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <Skeleton className="h-6 w-3/4 mb-2" />
        
        {/* Subtitle / Operator / Location */}
        <Skeleton className="h-4 w-1/2 mb-1" />
        <Skeleton className="h-4 w-1/3 mb-4" />
        
        {/* Bottom row (price, rating, etc) */}
        <div className="mt-auto flex justify-between items-center">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

interface SkeletonListProps {
  count?: number;
  className?: string;
}

export function SkeletonList({ count = 3, className }: SkeletonListProps) {
  return (
    <div className={clsx("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={clsx("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={clsx(
            "h-4", 
            i === lines - 1 ? "w-2/3" : "w-full"
          )} 
        />
      ))}
    </div>
  );
}

interface SkeletonImageProps {
  className?: string;
}

export function SkeletonImage({ className }: SkeletonImageProps) {
  return (
    <Skeleton className={clsx("w-full h-[400px]", className)} />
  );
}

interface SkeletonMapProps {
  className?: string;
}

export function SkeletonMap({ className }: SkeletonMapProps) {
  return (
    <Skeleton className={clsx("w-full h-[400px] bg-gray-200", className)} />
  );
}
