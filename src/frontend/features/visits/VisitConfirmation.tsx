import type { DemoPass, Venue, Visit } from "@/shared/types";
import { money, visitSurcharge } from "@/shared/pricing";
import { Actions, Button, DetailLine, Heading, Notice, Panel } from "../../components/ui";
import { useLanguage } from "../../i18n/LanguageProvider";

function IllustrativeQr() {
  return <svg aria-hidden="true" viewBox="0 0 21 21" shapeRendering="crispEdges"
    className="mx-auto my-5 size-36 border-8 border-white bg-white ring-1 ring-line">
    <rect width="21" height="21" fill="white" />
    <path fill="#17365f" d="M0 0h7v7H0zM1 1v5h5V1zM2 2h3v3H2zM14 0h7v7h-7zM15 1v5h5V1zM16 2h3v3h-3zM0 14h7v7H0zM1 15v5h5v-5zM2 16h3v3H2zM8 1h2v2H8zM10 4h2v2h-2zM8 7h3v2H8zM12 8h2v2h-2zM8 11h2v2H8zM11 12h2v2h-2zM14 9h2v3h-2zM17 8h2v2h-2zM8 15h2v2H8zM11 16h2v2h-2zM14 14h2v2h-2zM17 12h3v2h-3zM16 17h2v2h-2zM19 19h2v2h-2z" />
  </svg>;
}

export function VisitConfirmation({ venue, visit, pass, walkIn, onPass, onExplore }: {
  venue: Venue; visit: Visit; pass: DemoPass; walkIn: boolean; onPass: () => void; onExplore: () => void;
}) {
  const { locale, t } = useLanguage();
  return <>
    <Heading eyebrow={walkIn ? "Walk-in redemption · simulated" : "Booking confirmed · simulated"}
      title={walkIn ? "Ready for your visit" : "You're booked!"}
      description={walkIn ? "Real availability and booking rules are controlled by the playground."
        : "Illustrative confirmation for an advance-booking venue."} />
    <Panel className="mx-auto max-w-xl">
      <h2>{venue.name}</h2>
      <DetailLine label="Pass ID">{pass.id}</DetailLine>
      {walkIn ? <>
        <DetailLine label="Admissions remaining (demo)">{pass.quantities[venue.id]}</DetailLine>
        <Notice>{t("Show your pass confirmation at the venue. QR scanning is only illustrated here; actual redemption method must be agreed with the playground.")}</Notice>
      </> : <>
        <DetailLine label="Date / time">{visit.date} · {visit.slot}</DetailLine>
        <DetailLine label="Demo extra fee">{money(visitSurcharge(venue, visit.slot), locale)}</DetailLine>
        <IllustrativeQr />
        <p className="text-center text-sm text-muted">{t("Illustrative QR · not valid for real admission")}</p>
      </>}
      <Actions>
        <Button variant="secondary" onClick={onPass}>{t("Back to pass")}</Button>
        <Button onClick={onExplore}>{t("Done")}</Button>
      </Actions>
    </Panel>
  </>;
}
