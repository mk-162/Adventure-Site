"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Hook to manage a Set of string IDs persisted in localStorage.
 * Used for both "skipped stops" and "booked items" checklists.
 */
export function useLocalStorageSet(key: string) {
  const [items, setItems] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setItems(new Set(JSON.parse(stored)));
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, [key]);

  const toggle = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        localStorage.setItem(key, JSON.stringify([...next]));
        return next;
      });
    },
    [key]
  );

  const has = useCallback((id: string) => items.has(id), [items]);

  return { items, toggle, has, loaded };
}
