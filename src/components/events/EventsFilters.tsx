'use client';

import { useState, useMemo } from 'react';
import { EventCard } from '@/components/cards/event-card';

interface Event {
  event: {
    id: number;
    name: string;
    slug: string;
    date: string | null;
    type: string | null;
  };
  region: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

interface EventsFiltersProps {
  events: Event[];
}

export function EventsFilters({ events }: EventsFiltersProps) {
  const [selectedType, setSelectedType] = useState('All Events');

  const types = ['All Events', 'Running', 'Triathlon', 'Cycling', 'MTB', 'Festival', 'Walking'];

  // Filter events by type
  const filteredEvents = useMemo(() => {
    if (selectedType === 'All Events') {
      return events;
    }
    
    return events.filter((item) => {
      const eventType = item.event.type?.toLowerCase() || '';
      const filterType = selectedType.toLowerCase();
      
      // Check if event type matches or contains the filter
      return eventType.includes(filterType) || filterType.includes(eventType);
    });
  }, [events, selectedType]);

  return (
    <>
      {/* Filters */}
      <section className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedType === type
                    ? 'bg-[#1e3a4c] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {filteredEvents.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
            </p>
            <div className="space-y-4">
              {filteredEvents.map((item) => (
                <EventCard
                  key={item.event.id}
                  event={item.event}
                  region={item.region}
                  variant="list"
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <p className="text-gray-500 mb-2">No events found for {selectedType}</p>
            <button
              onClick={() => setSelectedType('All Events')}
              className="text-[#f97316] hover:text-[#ea580c] font-medium text-sm"
            >
              Show all events
            </button>
          </div>
        )}
      </div>
    </>
  );
}
