import { getAllRegions } from "@/lib/queries";
import { getItinerariesForListing } from "@/lib/queries";
import { ItineraryDiscovery } from "@/components/itineraries/ItineraryDiscovery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adventure Itineraries | Adventure Wales",
  description:
    "Expertly crafted multi-day adventure itineraries across Wales. Find your perfect trip from adrenaline weekends to family explorations.",
};

export default async function ItinerariesPage() {
  const [regions, itineraries] = await Promise.all([
    getAllRegions(),
    getItinerariesForListing(),
  ]);

  return (
    <ItineraryDiscovery 
      initialItineraries={itineraries} 
      regions={regions} 
    />
  );
}
