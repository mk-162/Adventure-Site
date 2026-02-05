"use client";

import { useState, useEffect, useCallback } from "react";
import { StickyNote, Save, Trash2 } from "lucide-react";

interface TripNotesProps {
  itinerarySlug: string;
}

export function TripNotes({ itinerarySlug }: TripNotesProps) {
  const storageKey = `aw-trip-notes-${itinerarySlug}`;
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setNotes(stored);
      setIsOpen(true);
    }
  }, [storageKey]);

  const saveNotes = useCallback(() => {
    if (notes.trim()) {
      localStorage.setItem(storageKey, notes);
    } else {
      localStorage.removeItem(storageKey);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [notes, storageKey]);

  const clearNotes = () => {
    setNotes("");
    localStorage.removeItem(storageKey);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-500 hover:text-primary border border-dashed border-gray-300 hover:border-primary rounded-xl transition-colors"
      >
        <StickyNote className="w-4 h-4" />
        Add Trip Notes
      </button>
    );
  }

  return (
    <div className="bg-amber-50/50 rounded-xl border border-amber-200/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-primary flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-amber-500" />
          My Trip Notes
        </h4>
        <div className="flex items-center gap-1">
          {notes.trim() && (
            <button
              onClick={clearNotes}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              title="Clear notes"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={saveNotes}
            className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
            title="Save notes"
          >
            <Save className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={saveNotes}
        placeholder="Jot down packing reminders, questions for operators, timing notes..."
        className="w-full bg-white rounded-lg border border-amber-200/50 p-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-amber-300/50"
        rows={4}
      />
      {saved && (
        <p className="text-xs text-green-600 mt-1">✓ Saved to your browser</p>
      )}
    </div>
  );
}
