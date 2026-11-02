import type { Quantities, Venue } from "@/shared/types";
import { Actions, Button, Heading, Notice, Panel, StepIndicator } from "../../components/ui";
import { useLanguage } from "../../i18n/LanguageProvider";
import { BundleSummary } from "./BundleSummary";

const terms = [
  "No expiry date on unused admissions.",
  "Each venue's booking policy applies: some accept walk-ins, others require advance booking.",
  "Discounted rates apply only during the venue's eligible window shown in its details.",
  "Outside that window, a venue may charge an additional fee; confirm price and availability before booking.",
  "Proposed policy for testing: unused pass refundable within 7 days; booked visits changeable up to 24 hours ahead. Needs partner/legal review.",
];

export function Review({ venues, quantities, onBack, onNext }: {
  venues: Venue[]; quantities: Quantities; onBack: () => void; onNext: () => void;
}) {
  const { t } = useLanguage();
  return <>
    <StepIndicator step={2} />
    <Heading eyebrow="Pass preview" title="More play, with savings." />
    <div className="grid items-start gap-5 lg:grid-cols-[1.7fr_1fr]">
      <Panel>
        {venues.filter(venue => quantities[venue.id]).map(venue =>
          <p key={venue.id} className="border-b border-line py-4 font-semibold">
            {venue.icon} {venue.name} × {quantities[venue.id]}
          </p>)}
        <h3 className="mt-5">{t("Pass terms")}</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
          {terms.map(term => <li key={term}>{t(term)}</li>)}
        </ul>
        <Notice>{t("No booking is automatically included. Follow each playground's own process to reserve or walk in.")}</Notice>
        <Actions>
          <Button variant="secondary" onClick={onBack}>{t("Edit bundle")}</Button>
          <Button onClick={onNext}>{t("Continue to checkout →")}</Button>
        </Actions>
      </Panel>
      <BundleSummary venues={venues} quantities={quantities} />
    </div>
  </>;
}
