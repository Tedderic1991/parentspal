import type { DemoPass, Venue } from "@/shared/types";
import { money } from "@/shared/pricing";
import { DetailLine, Panel } from "../../components/ui";
import { useLanguage } from "../../i18n/LanguageProvider";

export function PassTicket({ pass, venues, children }: {
  pass: DemoPass; venues: Venue[]; children?: React.ReactNode;
}) {
  const { locale, t } = useLanguage();
  const count = Object.values(pass.quantities).reduce((sum, quantity) => sum + quantity, 0);
  return <Panel className="mx-auto max-w-xl">
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2>Play Pass</h2>
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{t("No expiry")}</span>
    </div>
    <DetailLine label="Pass ID">{pass.id}</DetailLine>
    <DetailLine label="Purchase date">{new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
      dateStyle: "medium",
    }).format(new Date(pass.purchasedAt))}</DetailLine>
    <DetailLine label="Expiry date">{t("No expiry")}</DetailLine>
    <DetailLine label="Admissions purchased">{count}</DetailLine>
    <DetailLine label={locale === "fr" ? "Taille du groupe" : "Group size"}>
      {t(`${pass.family.adults} adults`)} · {t(`${pass.family.childAges.length} children`)}
    </DetailLine>
    <DetailLine label="Children's ages">
      {pass.family.childAges.length ? pass.family.childAges.map((age, index) =>
        <span key={index} className="block">{t(`Child ${index + 1}: ${age} years`)}</span>
      ) : (locale === "fr" ? "Aucun enfant" : "No children")}
    </DetailLine>
    <h3 className="mt-5">{t("Admissions by playground")}</h3>
    {venues.filter(venue => pass.quantities[venue.id]).map(venue =>
      <DetailLine key={venue.id} label={`${venue.icon} ${venue.name}`}>
        {t(`${pass.quantities[venue.id]} admissions`)}
      </DetailLine>)}
    <DetailLine label="Paid">{money(pass.totalCents, locale)}</DetailLine>
    <DetailLine label="Receipt email">{pass.email}</DetailLine>
    {children}
  </Panel>;
}
