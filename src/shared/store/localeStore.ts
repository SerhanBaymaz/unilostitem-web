import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Locale = 'tr' | 'en';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: (import.meta.env.VITE_DEFAULT_LOCALE as Locale) || 'tr',
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'locale-storage',
    }
  )
);
