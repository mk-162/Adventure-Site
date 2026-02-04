import { getAllRegions } from "@/lib/queries";
import { getItinerariesForListing } from "@/lib/queries";
import { ItineraryDiscovery } from "@/components/itineraries/ItineraryDiscovery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welsh Road Trips & Itineraries — Multi-Day Adventure Plans | Adventure Wales",
  description:
    "54 curated Welsh road trip itineraries from weekend breaks to week-long adventures. Snowdonia, Pembrokeshire, Brecon Beacons, and more with day-by-day plans.",
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
