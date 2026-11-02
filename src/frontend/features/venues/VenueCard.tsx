import type { Venue } from "@/shared/types";
import { venuePolicy } from "@/shared/catalog";
import { useLanguage } from "../../i18n/LanguageProvider";

export function VenueCard({ venue, onSelect }: { venue: Venue; onSelect: () => void }) {
  const { t } = useLanguage();
  return <button onClick={onSelect}
    className="overflow-hidden rounded-2xl border border-line bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md">
    <div aria-hidden="true" className="grid h-28 place-items-center bg-gradient-to-br from-sky-100 to-orange-100 text-5xl">
      {venue.icon}
    </div>
    <div className="space-y-2 p-4">
      <p className="text-xs font-semibold text-blue-700">
        {venue.area} · {t(`${venue.minAge}–${venue.maxAge} years`)}
      </p>
      <h3>{venue.name}</h3>
      <p className="text-sm text-muted">{t(venue.description)}</p>
      <p className="text-xs text-muted">{t(venuePolicy(venue))}</p>
    </div>
  </button>;
}
