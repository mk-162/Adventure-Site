import { Bus, Car, Compass, Plane, Train } from "lucide-react";

import { getRegionTransport } from "@/lib/region-transport";

interface TransportSectionProps {
  regionSlug: string;
  /** Extracted "Getting There" copy from the region description — omit for the generic default. */
  summary?: string | null;
}

/**
 * Getting There — transport section for a region page.
 * Renders train/bus/driving/air options plus car-free guidance and quick
 * links, sourced from the static `region-transport` dataset.
 */
export function TransportSection({ regionSlug, summary }: TransportSectionProps) {
  const transport = getRegionTransport(regionSlug);

  return (
    <div className="space-y-4">
      {summary && <p className="text-slate-600 text-sm leading-relaxed">{summary}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Train Stations */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Train className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-bold text-sm text-primary">By Train</h4>
          </div>
          <ul className="space-y-2">
            {transport.trainStations.map((station) => (
              <li key={station.name} className="text-sm">
                <span className="font-semibold text-primary">{station.name}</span>
                <p className="text-slate-500 text-sm mt-0.5">{station.info}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Bus Services */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-orange-50 p-2 rounded-lg">
              <Bus className="w-5 h-5 text-orange-600" />
            </div>
            <h4 className="font-bold text-sm text-primary">By Bus</h4>
          </div>
          <ul className="space-y-2">
            {transport.busServices.map((service) => (
              <li key={service.name} className="text-sm">
                <span className="font-semibold text-primary">{service.name}</span>
                <p className="text-slate-500 text-sm mt-0.5">{service.info}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Driving */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-green-50 p-2 rounded-lg">
              <Car className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="font-bold text-sm text-primary">By Car</h4>
          </div>
          <ul className="space-y-2">
            {transport.driving.map((route) => (
              <li key={route.route} className="text-sm">
                <span className="font-semibold text-primary">{route.route}</span>
                <p className="text-slate-500 text-sm mt-0.5">{route.info}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Airports */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-purple-50 p-2 rounded-lg">
              <Plane className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-bold text-sm text-primary">By Air</h4>
          </div>
          <ul className="space-y-2">
            {transport.airports.map((airport) => (
              <li key={airport.name} className="text-sm">
                <span className="font-semibold text-primary">{airport.name}</span>
                <p className="text-slate-500 text-sm mt-0.5">{airport.info}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Car-Free Options */}
      {transport.carFree && (
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Compass className="w-5 h-5 text-emerald-700" />
            </div>
            <h4 className="font-bold text-sm text-emerald-800">Car-Free Options</h4>
          </div>
          <p className="text-emerald-700 text-sm leading-relaxed">{transport.carFree}</p>
        </div>
      )}

      {/* Quick Links - Timetables & Taxis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Timetable Links */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
          <h4 className="font-bold text-sm text-primary mb-3">📅 Timetables &amp; Journey Planners</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="https://www.traveline.cymru/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                Traveline Cymru
              </a>
              <span className="text-slate-500 text-sm block">All Wales bus &amp; train times</span>
            </li>
            <li>
              <a href="https://tfwrail.wales/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                Transport for Wales Rail
              </a>
              <span className="text-slate-500 text-sm block">Train times &amp; ticket booking</span>
            </li>
            <li>
              <a href="https://www.nationalrail.co.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                National Rail
              </a>
              <span className="text-slate-500 text-sm block">UK-wide train planner</span>
            </li>
            <li>
              <a href="https://fflecsi.wales/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                fflecsi
              </a>
              <span className="text-slate-500 text-sm block">On-demand bus booking app</span>
            </li>
          </ul>
        </div>

        {/* Taxi & Car Hire */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
          <h4 className="font-bold text-sm text-primary mb-3">🚕 Taxis &amp; Car Hire</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="https://www.uber.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                Uber
              </a>
              <span className="text-slate-500 text-sm block">Available in larger towns</span>
            </li>
            <li>
              <a href="https://www.google.com/search?q=taxi+near+me+wales" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                Find Local Taxis
              </a>
              <span className="text-slate-500 text-sm block">Search for nearby taxi firms</span>
            </li>
            <li>
              <a href="https://www.enterprise.co.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                Enterprise
              </a>
              <span className="text-slate-500 text-sm block">Car hire — multiple Welsh locations</span>
            </li>
            <li>
              <a href="https://www.sixt.co.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                Sixt
              </a>
              <span className="text-slate-500 text-sm block">Car hire — Cardiff, Swansea, stations</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
