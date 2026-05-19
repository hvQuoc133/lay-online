import React, { createContext, useContext, ReactNode } from 'react';
import { usePrayer } from '../hooks/usePrayer';

export type PrayerContextType = ReturnType<typeof usePrayer>;

const PrayerContext = createContext<PrayerContextType | null>(null);

export function PrayerProvider({ children }: { children: ReactNode }) {
  const prayerData = usePrayer();
  return (
    <PrayerContext.Provider value={prayerData}>
      {children}
    </PrayerContext.Provider>
  );
}

export function usePrayerContext() {
  const context = useContext(PrayerContext);
  if (!context) {
    throw new Error("usePrayerContext must be used within a PrayerProvider");
  }
  return context;
}
