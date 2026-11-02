import { useState } from "react";
import type { Family } from "@/shared/types";
import { Actions, Button, Field, Heading, Panel, StepIndicator } from "../../components/ui";
import { useLanguage } from "../../i18n/LanguageProvider";
import { validateFamily } from "./state";

export function FamilyForm({ family, onChange, onBack, onNext }: {
  family: Family; onChange: (family: Family) => void; onBack: () => void; onNext: () => void;
}) {
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  return <>
    <StepIndicator step={0} />
    <Heading eyebrow="Personalize your pass" title="Who's going to play?"
      description="Tell us how many adults and children are in your group. Add each child's age so you can find age-appropriate play spots." />
    <Panel className="max-w-xl">
      <form onSubmit={event => {
        event.preventDefault();
        const error = validateFamily(family);
        setError(error);
        if (!error) onNext();
      }}>
        {(["adults", "children"] as const).map(kind => <div key={kind} className="my-4 grid gap-2">
          <label htmlFor={kind} className="text-sm font-semibold">{t(kind === "adults" ? "Number of adults" : "Number of children")}</label>
          <select id={kind} className="rounded-lg border border-line p-3"
            value={kind === "adults" ? family.adults : family.childAges.length}
            onChange={event => {
              const count = Number(event.target.value);
              onChange(kind === "adults" ? { ...family, adults: count } : {
                ...family, childAges: Array.from({ length: count }, (_, i) => family.childAges[i] ?? ""),
              });
              setError(null);
            }}>
            {Array.from({ length: 9 }, (_, number) => <option key={number}>{number}</option>)}
          </select>
        </div>)}
        {family.childAges.map((age, index) => <Field key={index} id={`child-age-${index}`}
          label={`Child ${index + 1} age`} type="number" min={0} max={17} step={1}
          required value={age} placeholder="Age in years"
          onChange={event => {
            onChange({ ...family, childAges: family.childAges.map((current, i) => i === index ? event.target.value : current) });
            setError(null);
          }} />)}
        {!family.childAges.length && <p className="my-4 text-sm text-muted">{t("No children added yet.")}</p>}
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={family.gift}
            onChange={event => onChange({ ...family, gift: event.target.checked })} />
          {t("I'm buying this as a gift")}
        </label>
        {error && <p role="alert" className="mt-4 text-red-700">{t(error)}</p>}
        <Actions>
          <Button variant="secondary" onClick={onBack}>{t("Back")}</Button>
          <Button type="submit">{t("Next: choose playgrounds →")}</Button>
        </Actions>
      </form>
    </Panel>
  </>;
}
