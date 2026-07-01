"use client";

import { useCallback, useEffect, useState } from "react";

export type FunnelData = {
  goal?: string;
  businessStage?: string;
  moreInfo?: string;
};

const STORAGE_KEY = "jg-funnel-intake";

/**
 * Persists the Project Discovery -> Schedule Consultation flow in
 * sessionStorage so answers survive navigation between the two steps
 * instead of being silently discarded.
 *
 * sessionStorage (not localStorage) is intentional: this is a single
 * booking session's scratch data - the real record is whatever gets
 * submitted to the backend at the end.
 */
export function useFunnelStorage() {
  const [data, setData] = useState<FunnelData>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        setData(JSON.parse(raw));
      }
    } catch {
      // sessionStorage unavailable - funnel still works, it just won't
      // carry data between steps.
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateData = useCallback((patch: Partial<FunnelData>) => {
    setData((prev) => {
      const next = { ...prev, ...patch };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Best-effort persistence; ignore storage failures.
      }
      return next;
    });
  }, []);

  const clearData = useCallback(() => {
    setData({});
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { data, updateData, clearData, isLoaded };
}
