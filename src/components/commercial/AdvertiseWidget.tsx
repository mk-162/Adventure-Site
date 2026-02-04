import Link from "next/link";

interface AdvertiseWidgetProps {
  variant?: "sidebar" | "inline" | "banner";
  context?: string; // e.g. "Snowdonia", "Coasteering", "Events"
}

export function AdvertiseWidget({ variant = "sidebar", context }: AdvertiseWidgetProps) {
  if (variant === "banner") {
    return (
      <div className="bg-gradient-to-r from-[#1e3a4c] to-[#2a5570] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-white text-lg">
            {context ? `Advertise in ${context}` : "Advertise Your Business"}
          </h3>
          <p className="text-white/70 text-sm mt-1">
            Reach thousands of adventure seekers looking for exactly what you offer.
          </p>
        </div>
        <Link
          href="/advertise"
          className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
        >
          Learn More
        </Link>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50/50">
        <p className="text-sm text-gray-500 mb-2">
          {context ? `Your business could appear here for "${context}"` : "Your business could appear here"}
        </p>
        <Link href="/advertise" className="text-[#f97316] font-semibold text-sm hover:underline">
          Advertise with us →
        </Link>
      </div>
    );
  }

  // sidebar (default)
  return (
    <div className="bg-gradient-to-br from-[#f97316]/5 to-[#f97316]/10 rounded-xl p-6 shadow-sm border border-[#f97316]/20">
      <h3 className="font-bold text-[#1e3a4c] mb-2">
        {context ? `Promote in ${context}` : "Promote Your Business"}
      </h3>
      <p className="text-sm text-gray-600 mb-3">
        Reach thousands of adventure seekers visiting this page.
      </p>
      <Link href="/advertise" className="inline-flex items-center gap-1 text-[#f97316] font-bold text-sm hover:underline">
        Advertise here →
      </Link>
    </div>
  );
}
