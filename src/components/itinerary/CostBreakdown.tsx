"use client";

import { useState, useEffect } from "react";
import { ItineraryStop } from "@/types/itinerary";
import { EnquireAllVendors } from "./EnquireAllVendors";
import { operators } from "@/db/schema";
import { Flag, Bed, Utensils, Car, Minus, Plus, Users, ChevronDown, ChevronUp, Heart } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";

type Operator = typeof operators.$inferSelect;

interface CostBreakdownProps {
  stops: ItineraryStop[];
  mode: "standard" | "wet" | "budget";
  itineraryName?: string;
  itineraryId?: number;
}

interface LineItem {
  title: string;
  type: string;
  perPerson: number;
  perPersonMax: number;
  childDiscount: boolean; // true = children typically get ~50% off
}

export function CostBreakdown({ stops, mode, itineraryName, itineraryId }: CostBreakdownProps) {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [expanded, setExpanded] = useState(true);

  // Save Trip state
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (!itineraryId) return;
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(!!data.user);
        if (data.user) {
          fetch(`/api/user/favourites?type=itinerary`)
            .then((res) => res.json())
            .then((favData) => {
              const isSaved = favData.favourites?.some(
                (f: any) => f.type === "itinerary" && f.itemId === itineraryId
              );
              setSaved(!!isSaved);
            });
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, [itineraryId]);

  async function handleSaveTrip() {
    if (!itineraryId) return;

    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    setSaveLoading(true);
    try {
      const res = await fetch("/api/user/favourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "itinerary", id: itineraryId }),
      });
      const data = await res.json();
      setSaved(data.saved);
    } catch {
      // Silently fail
    } finally {
      setSaveLoading(false);
    }
  }

  // Build line items from stops
  const lineItems: LineItem[] = stops
    .map((stop) => {
      let min = 0;
      let max = 0;
      let title = stop.title;

      if (mode === "wet" && stop.wetAltCostFrom) {
        min = Number(stop.wetAltCostFrom);
        max = Number(stop.wetAltCostTo || stop.wetAltCostFrom);
        if (stop.wetAltTitle) title = stop.wetAltTitle;
      } else if (mode === "budget" && stop.budgetAltCostFrom) {
        min = Number(stop.budgetAltCostFrom);
        max = Number(stop.budgetAltCostTo || stop.budgetAltCostFrom);
        if (stop.budgetAltTitle) title = stop.budgetAltTitle;
      } else {
        min = Number(stop.costFrom || 0);
        max = Number(stop.costTo || stop.costFrom || 0);
      }

      // Activities and food are per-person; accommodation is per-room (not multiplied by headcount)
      const childDiscount = stop.stopType === "activity";

      return {
        title,
        type: stop.stopType,
        perPerson: min,
        perPersonMax: max,
        childDiscount,
      };
    })
    .filter((item) => item.perPerson > 0 || item.perPersonMax > 0);

  // Group by type
  const activities = lineItems.filter((i) => i.type === "activity");
  const accommodationItems = lineItems.filter((i) => i.type === "accommodation");
  const foodItems = lineItems.filter((i) => i.type === "food");
  const transportItems = lineItems.filter((i) => i.type === "transport" || i.type === "freeform");

  // Calculate costs
  const CHILD_DISCOUNT = 0.5; // children typically ~50% of adult price
  const totalPeople = adults + children;

  function calcGroupCost(items: LineItem[], perRoom = false) {
    let min = 0;
    let max = 0;
    for (const item of items) {
      if (perRoom) {
        // Accommodation: price is per room/unit, not per person — scale roughly by rooms needed
        const rooms = Math.ceil(totalPeople / 2) || 1;
        min += item.perPerson * rooms;
        max += item.perPersonMax * rooms;
      } else {
        // Per-person pricing
        const adultCostMin = item.perPerson * adults;
        const adultCostMax = item.perPersonMax * adults;
        const childCostMin = item.childDiscount
          ? item.perPerson * CHILD_DISCOUNT * children
          : item.perPerson * children;
        const childCostMax = item.childDiscount
          ? item.perPersonMax * CHILD_DISCOUNT * children
          : item.perPersonMax * children;
        min += adultCostMin + childCostMin;
        max += adultCostMax + childCostMax;
      }
    }
    return { min: Math.round(min), max: Math.round(max) };
  }

  const activityCost = calcGroupCost(activities);
  const accommCost = calcGroupCost(accommodationItems, true);
  const foodCost = calcGroupCost(foodItems);
  const transportCost = calcGroupCost(transportItems);

  const totalMin = activityCost.min + accommCost.min + foodCost.min + transportCost.min;
  const totalMax = activityCost.max + accommCost.max + foodCost.max + transportCost.max;

  // Per-person average
  const perPersonMin = totalPeople > 0 ? Math.round(totalMin / totalPeople) : 0;
  const perPersonMax = totalPeople > 0 ? Math.round(totalMax / totalPeople) : 0;

  // Extract unique operators from stops
  const uniqueOperators = Array.from(
    new Map(
      stops
        .filter((stop) => stop.operator)
        .map((stop) => [stop.operator!.id, stop.operator!])
    ).values()
  ) as Operator[];

  const formatRange = (min: number, max: number) => {
    if (min === max || max === 0) return `£${min}`;
    return `£${min}–£${max}`;
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case "activity": return <Flag className="w-3.5 h-3.5 text-blue-500" />;
      case "accommodation": return <Bed className="w-3.5 h-3.5 text-green-500" />;
      case "food": return <Utensils className="w-3.5 h-3.5 text-orange-500" />;
      default: return <Car className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  const CategorySection = ({
    label,
    icon,
    items,
    cost,
    colorClass,
  }: {
    label: string;
    icon: React.ReactNode;
    items: LineItem[];
    cost: { min: number; max: number };
    colorClass: string;
  }) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className={clsx("text-xs font-bold uppercase tracking-wider", colorClass)}>
              {label}
            </span>
          </div>
          <span className="text-sm font-bold text-gray-900">{formatRange(cost.min, cost.max)}</span>
        </div>
        <div className="space-y-1 pl-6">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs text-gray-500">
              <span className="truncate pr-2">{item.title}</span>
              <span className="shrink-0 text-gray-600 font-medium">
                {formatRange(item.perPerson, item.perPersonMax)}
                {item.type !== "accommodation" && <span className="text-gray-400">/pp</span>}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 sticky top-24 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-bold text-[#1e3a4c]">Trip Cost</h3>
          <span className="font-bold capitalize text-xs bg-gray-100 text-[#1e3a4c] px-2 py-1 rounded">
            {mode}
          </span>
        </div>
      </div>

      {/* Party size controls */}
      <div className="px-6 pt-4 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Group</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* Adults */}
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Adults</div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30"
                disabled={adults <= 1}
              >
                <Minus className="w-3.5 h-3.5 text-gray-600" />
              </button>
              <span className="text-lg font-bold text-[#1e3a4c] tabular-nums">{adults}</span>
              <button
                onClick={() => setAdults(Math.min(20, adults + 1))}
                className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>
          </div>
          {/* Children */}
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Children</div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30"
                disabled={children <= 0}
              >
                <Minus className="w-3.5 h-3.5 text-gray-600" />
              </button>
              <span className="text-lg font-bold text-[#1e3a4c] tabular-nums">{children}</span>
              <button
                onClick={() => setChildren(Math.min(20, children + 1))}
                className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        {children > 0 && (
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            Child prices estimated at ~50% of adult rate for activities
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-6" />

      {/* Itemised breakdown */}
      <div className="px-6 py-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full mb-3 group"
        >
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-gray-700 transition-colors">
            Cost Breakdown
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {expanded && (
          <div className="space-y-4">
            <CategorySection
              label="Activities"
              icon={<Flag className="w-4 h-4 text-blue-500" />}
              items={activities}
              cost={activityCost}
              colorClass="text-blue-600"
            />
            <CategorySection
              label="Accommodation"
              icon={<Bed className="w-4 h-4 text-green-500" />}
              items={accommodationItems}
              cost={accommCost}
              colorClass="text-green-600"
            />
            <CategorySection
              label="Food & Drink"
              icon={<Utensils className="w-4 h-4 text-orange-500" />}
              items={foodItems}
              cost={foodCost}
              colorClass="text-orange-600"
            />
            <CategorySection
              label="Transport"
              icon={<Car className="w-4 h-4 text-gray-500" />}
              items={transportItems}
              cost={transportCost}
              colorClass="text-gray-600"
            />
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 mx-6" />

      {/* Totals */}
      <div className="px-6 py-4 bg-gray-50/50">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-bold text-[#1e3a4c]">Group Total</span>
          <span className="text-lg font-black text-[#ea580c]">{formatRange(totalMin, totalMax)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Per person avg.</span>
          <span className="text-sm font-bold text-gray-600">{formatRange(perPersonMin, perPersonMax)}</span>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          Estimates based on published rates • actual prices may vary
        </p>
      </div>

      {/* CTA */}
      <div className="px-6 pb-6 pt-2">
        <button
          onClick={handleSaveTrip}
          disabled={saveLoading}
          className={clsx(
            "w-full font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2",
            saved
              ? "bg-green-600 hover:bg-green-700 text-white shadow-green-600/30"
              : "bg-[#ea580c] hover:bg-[#ea580c]/90 text-white shadow-[#ea580c]/30"
          )}
        >
          <Heart className={clsx("w-5 h-5 transition-all", saved ? "fill-white" : "")} />
          {saveLoading ? "Saving…" : saved ? "Saved!" : "Save This Trip"}
        </button>
        <p className="text-center text-xs text-gray-400 mt-2">
          {saved ? "This trip is saved to your adventures" : "Save your plan and book each part directly"}
        </p>

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

      {/* Login prompt modal */}
      {showLoginPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowLoginPrompt(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-[#ea580c]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1e3a4c]">
                Save this trip
              </h2>
              <p className="text-gray-600">
                Sign in to save this itinerary to your adventures so you can find it later.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                <Link
                  href={`/login?from=${typeof window !== "undefined" ? encodeURIComponent(window.location.pathname) : ""}`}
                  className="flex-1 px-6 py-3 bg-[#ea580c] text-white font-semibold rounded-lg hover:bg-[#ea580c] transition-colors text-center"
                >
                  Sign in to save
                </Link>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
