import type { Quantities, Venue } from "@/shared/types";
import { demoOptions } from "@/shared/options";
import { calculateBundle, money } from "@/shared/pricing";
import { venuePolicy } from "@/shared/catalog";
import { Actions, Button, Heading, Notice, Panel, StepIndicator } from "../../components/ui";
import { useLanguage } from "../../i18n/LanguageProvider";
import { BundleSummary } from "./BundleSummary";

export function BundleSelection({ venues, quantities, onQuantity, onBack, onNext }: {
  venues: Venue[]; quantities: Quantities;
  onQuantity: (id: string, delta: number) => void; onBack: () => void; onNext: () => void;
}) {
  const { locale, t } = useLanguage();
  return <>
    <StepIndicator step={1} />
    <Heading eyebrow="Build your own bundle" title="Choose your play stops"
      description={`Choose at least ${demoOptions.bundle.minimumAdmissions} admissions. Adjust quantities for each playground.`} />
    <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr] lg:items-start">
      <Panel>
        {venues.map(venue => <div key={venue.id} className="flex flex-wrap items-center gap-3 border-b border-line py-4">
          <div aria-hidden="true" className="grid size-12 place-items-center rounded-xl bg-wash text-3xl">{venue.icon}</div>
          <div className="min-w-40 flex-1">
            <h3>{venue.name}</h3>
            <p className="text-sm text-muted">{venue.area} · {money(venue.priceCents, locale)}</p>
            <p className="text-xs text-muted">{t(venuePolicy(venue))}</p>
            <p className="text-xs text-muted">{t("Pass window")}: {t(venue.window)}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="px-3 py-1"
              aria-label={`${t("Decrease admissions for")} ${venue.name}`}
              disabled={!quantities[venue.id]} onClick={() => onQuantity(venue.id, -1)}>−</Button>
            <output aria-label={`${venue.name} ${t("Admissions")}`} className="w-6 text-center font-bold">
              {quantities[venue.id] ?? 0}
            </output>
            <Button variant="secondary" className="px-3 py-1"
              aria-label={`${t("Increase admissions for")} ${venue.name}`}
              disabled={quantities[venue.id] >= demoOptions.bundle.maximumQuantity} onClick={() => onQuantity(venue.id, 1)}>+</Button>
          </div>
        </div>)}
        <Notice>{t(`Sample pricing: ${demoOptions.bundle.discountPercent}% off selected admissions. Booking and time-window policies vary by venue.`)}</Notice>
        <Actions>
          <Button variant="secondary" onClick={onBack}>{t("Back")}</Button>
          <Button disabled={!calculateBundle(venues, quantities).meetsMinimum} onClick={onNext}>{t("Calculate my pass →")}</Button>
        </Actions>
      </Panel>
      <BundleSummary venues={venues} quantities={quantities} />
    </div>
  </>;
}
