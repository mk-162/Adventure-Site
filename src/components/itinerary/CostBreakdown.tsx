"use client";

import { ItineraryStop } from "@/types/itinerary";
import { EnquireAllVendors } from "./EnquireAllVendors";
import { operators } from "@/db/schema";

type Operator = typeof operators.$inferSelect;

interface CostBreakdownProps {
  stops: ItineraryStop[];
  mode: "standard" | "wet" | "budget";
  itineraryName?: string;
}

export function CostBreakdown({ stops, mode, itineraryName }: CostBreakdownProps) {
  // Calculate total costs based on mode
  let totalMin = 0;
  let totalMax = 0;

  stops.forEach(stop => {
    let min = 0;
    let max = 0;

    if (mode === "wet" && stop.wetAltCostFrom) {
       min = Number(stop.wetAltCostFrom);
       max = Number(stop.wetAltCostTo || stop.wetAltCostFrom);
    } else if (mode === "budget" && stop.budgetAltCostFrom) {
       min = Number(stop.budgetAltCostFrom);
       max = Number(stop.budgetAltCostTo || stop.budgetAltCostFrom);
    } else {
       min = Number(stop.costFrom || 0);
       max = Number(stop.costTo || stop.costFrom || 0);
    }
    
    totalMin += min;
    totalMax += max;
  });

  // Extract unique operators from stops
  const uniqueOperators = Array.from(
    new Map(
      stops
        .filter(stop => stop.operator)
        .map(stop => [stop.operator!.id, stop.operator!])
    ).values()
  ) as Operator[];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
        <h3 className="text-xl font-bold text-[#1e3a4c] mb-6">Estimated Costs</h3>
        
        <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Trip Mode</span>
                <span className="font-bold capitalize text-[#1e3a4c] bg-gray-100 px-2 py-1 rounded">{mode}</span>
            </div>
             <div className="h-px bg-gray-100 my-4" />
             <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-[#1e3a4c]">Total Estimate</span>
                <span className="text-[#f97316]">£{totalMin} - £{totalMax}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
                * Prices are estimates per person based on current data.
            </p>
        </div>

        <button className="w-full bg-[#f97316] hover:bg-[#f97316]/90 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#f97316]/30 transition-all active:scale-95 mt-6">
            Book Entire Trip
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">No payment required today</p>

        {/* Enquire All Vendors CTA */}
        {uniqueOperators.length > 0 && itineraryName && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">
              Or send an enquiry to all operators
            </p>
            <EnquireAllVendors 
              operators={uniqueOperators}
              itineraryName={itineraryName}
              variant="sidebar"
            />
          </div>
        )}
    </div>
  );
}
