"use client";

import { useState } from "react";
import { Plus, X, PenLine } from "lucide-react";

interface CustomStop {
  id: string;
  text: string;
  dayNumber: number;
}

interface CustomStopFormProps {
  itinerarySlug: string;
  dayNumber: number;
  onAdd?: (stop: CustomStop) => void;
}

export function CustomStopForm({ itinerarySlug, dayNumber }: CustomStopFormProps) {
  const storageKey = `aw-custom-stops-${itinerarySlug}`;
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [customStops, setCustomStops] = useState<CustomStop[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored).filter((s: CustomStop) => s.dayNumber === dayNumber) : [];
    } catch {
      return [];
    }
  });

  const addStop = () => {
    if (!text.trim()) return;
    const newStop: CustomStop = {
      id: `custom-${Date.now()}`,
      text: text.trim(),
      dayNumber,
    };
    
    const allStops = (() => {
      try {
        const stored = localStorage.getItem(storageKey);
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    })();
    
    const updated = [...allStops, newStop];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setCustomStops(prev => [...prev, newStop]);
    setText("");
    setIsOpen(false);
  };

  const removeStop = (id: string) => {
    try {
      const stored = localStorage.getItem(storageKey);
      const allStops = stored ? JSON.parse(stored) : [];
      const updated = allStops.filter((s: CustomStop) => s.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
    setCustomStops(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="mt-3">
      {/* Custom stops list */}
      {customStops.map(stop => (
        <div key={stop.id} className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg mb-2 group">
          <PenLine className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
          <span className="text-sm text-blue-800 flex-1">{stop.text}</span>
          <button
            onClick={() => removeStop(stop.id)}
            className="text-blue-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}

      {/* Add form */}
      {isOpen ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addStop()}
            placeholder="e.g. Pick up hire car, Visit Portmeirion..."
            className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            autoFocus
          />
          <button
            onClick={addStop}
            className="px-3 py-2 bg-[#1e3a4c] text-white text-sm font-medium rounded-lg hover:bg-[#1e3a4c]/90"
          >
            Add
          </button>
          <button
            onClick={() => { setIsOpen(false); setText(""); }}
            className="px-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#1e3a4c] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add your own stop
        </button>
      )}
    </div>
  );
}
