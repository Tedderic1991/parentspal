import { useState } from "react";
import type { DemoPass, Venue, Visit } from "@/shared/types";
import { money, visitSurcharge } from "@/shared/pricing";
import { demoOptions } from "@/shared/options";
import { venuePolicy } from "@/shared/catalog";
import { Actions, Button, DetailLine, Field, Heading, Notice, Panel } from "../../components/ui";
import { useLanguage } from "../../i18n/LanguageProvider";

export function VisitPlanner({ venues, pass, visit, onChange, onBack, onConfirm }: {
  venues: Venue[]; pass: DemoPass; visit: Visit;
  onChange: (visit: Visit) => void; onBack: () => void; onConfirm: (walkIn: boolean) => void;
}) {
  const { locale, t } = useLanguage();
  const [error, setError] = useState(false);
  const eligible = venues.filter(venue => pass.quantities[venue.id] > 0);
  const venue = eligible.find(venue => venue.id === visit.venueId);
  if (!venue) throw new Error("The selected venue is not included in this pass.");
  const surcharge = visitSurcharge(venue, visit.slot);

  return <>
    <Heading eyebrow="Visit planning" title={venue.walkIn ? "Walk-in visit" : "Book your visit"}
      description={venue.walkIn
        ? "This playground accepts walk-ins in this demo. Online booking is not required; check venue hours/capacity before you go."
        : "This playground requires advance booking. Select a demo date and time to request a reservation."} />
    <div className="grid items-start gap-5 lg:grid-cols-[1.7fr_1fr]">
      <Panel>
        <form onSubmit={event => {
          event.preventDefault();
          if (!venue.walkIn && !visit.date) { setError(true); return; }
          onConfirm(venue.walkIn);
        }}>
          <div className="my-4 grid gap-2">
            <label htmlFor="venue" className="text-sm font-semibold">{t("Playground")}</label>
            <select id="venue" className="w-full rounded-lg border border-line p-3"
              value={visit.venueId} onChange={event => {
                onChange({ ...visit, venueId: event.target.value });
                setError(false);
              }}>
              {eligible.map(venue => <option key={venue.id} value={venue.id}>
                {venue.name} — {t(venue.walkIn ? "walk-in" : "advance booking")}
              </option>)}
            </select>
          </div>
          {venue.walkIn && <Notice good>
            {t("Your pass is used at the venue. No ParentsPal time-slot booking is simulated for this location. Confirm operating hours and availability directly with the playground.")}
          </Notice>}
          <Field id="visit-date" label={venue.walkIn ? "Optional planned visit date" : "Visit date"}
            type="date" required={!venue.walkIn} value={visit.date}
            onChange={event => { onChange({ ...visit, date: event.target.value }); setError(false); }} />
          {!venue.walkIn && <>
            <fieldset className="space-y-3">
              <legend className="mb-3 font-semibold">{t("Available demo time slots")}</legend>
              {demoOptions.visitSlots.map(slot => <Button key={slot.time} variant="secondary"
                aria-pressed={visit.slot === slot.time}
                className={`flex w-full justify-between gap-3 ${visit.slot === slot.time ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => onChange({ ...visit, slot: slot.time })}>
                <span>{slot.time}</span>
                <span>{t(slot.outsideWindow ? "Outside window" : "Pass window")}</span>
              </Button>)}
            </fieldset>
            <Notice good={!surcharge}>{surcharge
              ? `${t("Demo extra fee")}: ${money(surcharge, locale)} / ${t("Admissions")}`
              : t("Within illustrative discounted window; no demo surcharge.")}</Notice>
            <p className="text-sm text-muted">{locale === "fr"
              ? "Créneaux et suppléments fictifs par entrée; confirmez les tarifs et disponibilités auprès du lieu."
              : "Illustrative slots and surcharge per admission; confirm final price and availability with the venue."}</p>
          </>}
          {error && <p role="alert" className="mt-4 text-red-700">{t("Please choose a visit date.")}</p>}
          <Actions>
            <Button variant="secondary" onClick={onBack}>{t("Back")}</Button>
            <Button type="submit">{t(venue.walkIn ? "Show walk-in pass instructions" : "Confirm demo booking")}</Button>
          </Actions>
        </form>
      </Panel>
      <aside className="rounded-2xl bg-wash p-5">
        <h3>{venue.name}</h3>
        <DetailLine label="Venue policy">{t(venuePolicy(venue))}</DetailLine>
        <DetailLine label="Pass time window">{t(venue.window)}</DetailLine>
        {!venue.walkIn && <DetailLine label="Demo extra fee">{money(surcharge, locale)}</DetailLine>}
        <p className="mt-4 text-sm text-muted">{t("Real availability and booking rules are controlled by the playground.")}</p>
      </aside>
    </div>
  </>;
}
