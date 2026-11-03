import type { Quantities, Venue } from "@/shared/types";
import { demoOptions } from "@/shared/options";
import { calculateBundle, money } from "@/shared/pricing";
import { Actions, Button, Field, Heading, Notice, Panel, StepIndicator } from "../../components/ui";
import { useLanguage } from "../../i18n/LanguageProvider";
import { BundleSummary } from "../pass-builder/BundleSummary";

export function Checkout({ venues, quantities, gift, email, name, payment, onChange, onBack, onPurchase }: {
  venues: Venue[]; quantities: Quantities; gift: boolean; email: string; name: string; payment: string;
  onChange: (value: { email?: string; name?: string; payment?: string }) => void;
  onBack: () => void; onPurchase: () => void;
}) {
  const { locale, t } = useLanguage();
  return <>
    <StepIndicator step={3} />
    <Heading eyebrow="Simulated checkout" title={gift ? "Send a play-filled gift" : "Almost ready for play"} />
    <div className="grid items-start gap-5 lg:grid-cols-[1.7fr_1fr]">
      <Panel>
        <form onSubmit={event => { event.preventDefault(); onPurchase(); }}>
          <fieldset>
            <legend className="font-bold">{t("Payment method")}</legend>
            <div className="my-3 grid grid-cols-2 gap-3">
              {demoOptions.paymentMethods.map(method =>
                <Button key={method} variant="secondary" aria-pressed={payment === method}
                  className={payment === method ? "ring-2 ring-blue-500" : ""}
                  onClick={() => onChange({ payment: method })}>
                  {method === "Card" ? (locale === "fr" ? "Carte" : method) : method}
                </Button>)}
            </div>
          </fieldset>
          <Field label="Email for pass delivery" id="email" type="email" autoComplete="email"
            required value={email} placeholder="you@example.com"
            onChange={event => onChange({ email: event.target.value })} />
          <Field label="Name" id="name" autoComplete="name" value={name}
            placeholder="Your name" onChange={event => onChange({ name: event.target.value })} />
          {gift && <Notice>{t("Gift recipient details would be collected here in a production checkout. Gift delivery is simulated.")}</Notice>}
          <Notice>{t("Demo only—no charge, account, or email will be created.")}</Notice>
          <Actions>
            <Button variant="secondary" onClick={onBack}>{t("Back")}</Button>
            <Button type="submit">
              {locale === "fr" ? "Terminer l’achat" : "Complete purchase"} · {money(calculateBundle(venues, quantities).totalCents, locale)}
            </Button>
          </Actions>
        </form>
      </Panel>
      <BundleSummary venues={venues} quantities={quantities} />
    </div>
  </>;
}
