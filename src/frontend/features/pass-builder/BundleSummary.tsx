import { calculateBundle, money } from "@/shared/pricing";
import type { Quantities, Venue } from "@/shared/types";
import { DetailLine } from "../../components/ui";
import { useLanguage } from "../../i18n/LanguageProvider";

export function BundleSummary({ venues, quantities }: { venues: Venue[]; quantities: Quantities }) {
  const { locale, t } = useLanguage();
  const bundle = calculateBundle(venues, quantities);
  return <aside aria-live="polite" className="rounded-2xl bg-wash p-5 lg:sticky lg:top-24">
    <p className="mb-2 text-xs font-bold uppercase tracking-widest">{t("Your bundle")}</p>
    <h2>{t(`${bundle.count} admissions`)}</h2>
    <DetailLine label="Regular subtotal">{money(bundle.subtotalCents, locale)}</DetailLine>
    <DetailLine label="Discount (10%)">−{money(bundle.discountCents, locale)}</DetailLine>
    <DetailLine label="Pass total">{money(bundle.totalCents, locale)}</DetailLine>
    <p className="mt-3 text-sm text-muted">{t(bundle.meetsMinimum ? "Minimum met." : `Add ${3 - bundle.count} more admissions.`)}</p>
  </aside>;
}
