import type { ReactNode } from "react";
import type { DataMode } from "@/shared/types";
import { useLanguage } from "../i18n/LanguageProvider";

export function SiteShell({ children, onExplore, onPass, dataMode }: {
  children: ReactNode; onExplore: () => void; onPass: () => void; dataMode: DataMode;
}) {
  const { locale, toggleLanguage, t } = useLanguage();
  return <>
    <a href="#content" className="sr-only focus:not-sr-only">{t("Skip to content")}</a>
    <header className="sticky top-0 z-20 border-b border-line bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <button onClick={onExplore} aria-label="ParentsPal" className="text-2xl font-extrabold tracking-tight">
          Parents<span className="bg-gradient-to-r from-red-400 via-orange-400 to-purple-400 bg-clip-text text-transparent">Pal</span>
        </button>
        <nav aria-label="ParentsPal" className="flex items-center gap-2 text-xs sm:gap-4 sm:text-sm">
          <button className="px-1 py-2 font-semibold" onClick={onExplore}>{t("Explore")}</button>
          <button className="px-1 py-2 font-semibold" onClick={onPass}>{t("My pass")}</button>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800">Demo</span>
          <button className="rounded-lg border border-line px-2 py-1 font-bold"
            onClick={toggleLanguage}
            aria-label={locale === "en" ? "Passer en français" : "Switch to English"}>
            {locale === "en" ? "FR" : "EN"}
          </button>
        </nav>
      </div>
    </header>
    <main id="content" tabIndex={-1} className="mx-auto min-h-[75vh] max-w-6xl px-4 py-8 outline-none sm:px-6">
      {children}
    </main>
    <footer className="border-t border-line p-5 text-center text-xs text-muted">
      <p>ParentsPal · Playground Pass</p>
      <p className="mt-2">{t("Interactive concept · no real payment or booking")}</p>
      <p className="mt-2">{t("Demo data resets when you refresh this page.")}</p>
      {dataMode === "supabase" && <p className="mt-2">
        {t("Venue catalog connected; checkout and bookings remain simulated.")}
      </p>}
    </footer>
  </>;
}
