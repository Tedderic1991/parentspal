import Image from "next/image";
import type { Venue } from "@/shared/types";
import { demoOptions } from "@/shared/options";
import { venuePolicy } from "@/shared/catalog";
import { money } from "@/shared/pricing";
import { Actions, Button, DetailLine, Heading, Panel } from "../../components/ui";
import { useLanguage } from "../../i18n/LanguageProvider";
import { VenueCard } from "./VenueCard";

const benefits = [
  ["⌖", "Discover fun spots", "bg-rose-500"],
  ["$", "Save on visits", "bg-orange-400"],
  ["▦", "Book in one place", "bg-blue-500"],
  ["◷", "No expiry date — go when it works for you", "bg-purple-500"],
];

export function Explore({ venues, onBuild }: {
  venues: Venue[]; onBuild: () => void;
}) {
  const { t } = useLanguage();
  return <>
    <section className="mb-8 grid gap-6 rounded-3xl bg-gradient-to-br from-sky-200 via-orange-100 to-purple-200 p-6 sm:p-9 lg:grid-cols-2">
      <div className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">{t("Play Pass · Winter demo")}</p>
        <h1 className="text-4xl sm:text-5xl">{t("More places to play.")}<br />{t("Less hassle.")}</h1>
        <div className="grid grid-cols-2 gap-5">
          {benefits.map(([symbol, label, color]) => <div key={label} className="space-y-2">
            <span aria-hidden="true" className={`grid size-11 place-items-center rounded-full text-2xl text-white ${color}`}>{symbol}</span>
            <p className="text-sm font-semibold">{t(label)}</p>
          </div>)}
        </div>
        <Button onClick={onBuild}>{t("Build a pass →")}</Button>
        <p className="text-sm text-muted">{t("Build your own bundle or purchase a gift.")}</p>
      </div>
      <div className="relative min-h-60 overflow-hidden rounded-2xl">
        <Image src={`${process.env.PARENTSPAL_BASE_PATH}/images/playground.jpg`} alt={t("Discover fun spots")} fill priority
          sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      </div>
    </section>
    <Heading eyebrow="Sample partner venues" title="Find your kind of play" description="Fictional demo data" />
    <div className="grid grid-cols-1 gap-4 min-[440px]:grid-cols-2 lg:grid-cols-3">
      {venues.map(venue => <VenueCard key={venue.id} venue={venue} />)}
      <Panel className="flex flex-col justify-center gap-4">
        <h3>{t("Make your own bundle")}</h3>
        <p className="text-sm text-muted">{t(`Pick ${demoOptions.bundle.minimumAdmissions} or more admissions across venues.`)}</p>
        <Button onClick={onBuild}>{t("Explore pass")}</Button>
      </Panel>
    </div>
  </>;
}

export function VenueDetails({ venue, onBack, onBuild }: {
  venue: Venue; onBack: () => void; onBuild: () => void;
}) {
  const { locale, t } = useLanguage();
  return <Panel>
    <Button variant="secondary" onClick={onBack}>{t("Back")}</Button>
    <div aria-hidden="true" className="my-5 grid h-36 place-items-center rounded-xl bg-wash text-6xl">{venue.icon}</div>
    <Heading eyebrow={`${venue.area} · ${t(`${venue.minAge}–${venue.maxAge} years`)}`}
      title={venue.name} description={venue.description} />
    <DetailLine label="Regular admission">{money(venue.priceCents, locale)}</DetailLine>
    <DetailLine label="Venue policy">{t(venuePolicy(venue))}</DetailLine>
    <DetailLine label="Eligible discounted window">{t(venue.window)}</DetailLine>
    <p className="mt-4 text-sm text-muted">
      {t("Pass does not expire. The discount is subject to the venue's stated time window and booking policy.")}
    </p>
    <Actions><Button onClick={onBuild}>{t("Build my pass")}</Button></Actions>
  </Panel>;
}
