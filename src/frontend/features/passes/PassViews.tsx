import type { DemoPass, Venue } from "@/shared/types";
import { Actions, Button, Field, Heading, Notice, Panel } from "../../components/ui";
import { useLanguage } from "../../i18n/LanguageProvider";
import { PassTicket } from "./PassTicket";

export function PurchaseConfirmation({ pass, venues, onAccount, onPass }: {
  pass: DemoPass; venues: Venue[]; onAccount: () => void; onPass: () => void;
}) {
  const { t } = useLanguage();
  return <>
    <Heading eyebrow="Purchase complete · simulated" title="Let the fun begin!"
      description="In a real launch, your pass would be emailed to you." />
    <PassTicket pass={pass} venues={venues}>
      <Notice>{t("Create an account to store your pass and access it later.")}</Notice>
      <Actions>
        <Button variant="secondary" onClick={onPass}>{t("My pass")}</Button>
        <Button onClick={onAccount}>{t("Create account to store pass")}</Button>
      </Actions>
    </PassTicket>
  </>;
}

export function MyPass({ pass, venues, onExplore, onPlan, onBuild }: {
  pass: DemoPass | null; venues: Venue[]; onExplore: () => void; onPlan: () => void; onBuild: () => void;
}) {
  const { t } = useLanguage();
  if (!pass) return <Panel className="mx-auto max-w-xl">
    <Heading eyebrow="Your demo account" title="No pass yet"
      description="Build a pass to plan your next visit." />
    <Button onClick={onBuild}>{t("Build a pass →")}</Button>
  </Panel>;

  return <>
    <Heading eyebrow="Your demo account" title="My pass"
      description="Use the venue's own booking or walk-in policy to plan your visit." />
    <PassTicket pass={pass} venues={venues}>
      <Notice>{t("For redemption, show this pass ID and the admission count for the venue you visit. Venue booking and entry rules still apply.")}</Notice>
      <Actions>
        <Button variant="secondary" onClick={onExplore}>{t("Explore venues")}</Button>
        <Button onClick={onPlan}>{t("Plan a visit")}</Button>
      </Actions>
    </PassTicket>
  </>;
}

export function DemoAccount({ name, email, onChange, onDone }: {
  name: string; email: string; onChange: (value: { name?: string; email?: string }) => void; onDone: () => void;
}) {
  const { t } = useLanguage();
  return <>
    <Heading eyebrow="Optional demo account" title="Keep your pass close"
      description="Checkout information is prefilled for convenience." />
    <Panel className="mx-auto max-w-xl">
      <form onSubmit={event => { event.preventDefault(); onDone(); }}>
        <Field id="account-name" label="Name" value={name}
          onChange={event => onChange({ name: event.target.value })} />
        <Field id="account-email" label="Email for pass delivery" type="email" required value={email}
          onChange={event => onChange({ email: event.target.value })} />
        <Notice good>{t("Account creation is simulated.")}</Notice>
        <Actions>
          <Button variant="secondary" onClick={onDone}>{t("Not now")}</Button>
          <Button type="submit">{t("Create demo account")}</Button>
        </Actions>
      </form>
    </Panel>
  </>;
}
