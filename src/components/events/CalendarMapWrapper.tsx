"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/ui/MapView"), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-xl" />
});

interface CalendarMapWrapperProps {
  markers: any[];
  center: [number, number];
  zoom: number;
  height: string;
}

export function CalendarMapWrapper(props: CalendarMapWrapperProps) {
  return <MapView {...props} />;
}
