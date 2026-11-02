"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Locale } from "@/shared/types";
import { translate } from "./translate";

interface LanguageContext {
  locale: Locale;
  toggleLanguage: () => void;
  t: (value: string) => string;
}

const Context = createContext<LanguageContext | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);

  return (
    <Context.Provider value={{
      locale,
      toggleLanguage: () => setLocale(current => current === "en" ? "fr" : "en"),
      t: value => translate(value, locale),
    }}>
      {children}
    </Context.Provider>
  );
}

export function useLanguage() {
  const context = useContext(Context);
  if (!context) throw new Error("useLanguage requires LanguageProvider.");
  return context;
}
