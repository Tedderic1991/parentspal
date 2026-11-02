import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { useLanguage } from "../i18n/LanguageProvider";

export function Button({
  variant = "primary", className = "", ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }) {
  return <button type="button" {...props} className={
    `rounded-xl px-4 py-3 text-sm font-bold transition ${
      variant === "primary"
        ? "bg-gradient-to-r from-accent to-orange-400 text-white hover:brightness-95"
        : "border border-line bg-white text-ink hover:bg-wash"
    } ${className}`
  } />;
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-line bg-white p-5 shadow-sm ${className}`}>
    {children}
  </section>;
}

export function Notice({ children, good = false }: { children: ReactNode; good?: boolean }) {
  return <p className={`my-4 rounded-xl p-3 text-sm ${good
    ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>{children}</p>;
}

export function Heading({ eyebrow, title, description }: {
  eyebrow: string; title: string; description?: string;
}) {
  const { t } = useLanguage();
  return <div className="mb-6 space-y-2">
    <p className="text-xs font-bold uppercase tracking-widest text-blue-700">{t(eyebrow)}</p>
    <h1>{t(title)}</h1>
    {description && <p className="max-w-2xl text-muted">{t(description)}</p>}
  </div>;
}

export function Field({ label, id, ...props }: InputHTMLAttributes<HTMLInputElement> & {
  label: string; id: string;
}) {
  const { t } = useLanguage();
  return <div className="my-4 grid gap-2">
    <label htmlFor={id} className="text-sm font-semibold">{t(label)}</label>
    <input id={id} {...props}
      className="w-full rounded-lg border border-line bg-white p-3 text-ink"
      placeholder={props.placeholder ? t(props.placeholder) : undefined} />
  </div>;
}

export function DetailLine({ label, children }: { label: string; children: ReactNode }) {
  const { t } = useLanguage();
  return <div className="flex flex-wrap justify-between gap-3 border-b border-line py-3 text-sm">
    <span className="text-muted">{t(label)}</span>
    <span className="min-w-0 break-words font-semibold [overflow-wrap:anywhere]">{children}</span>
  </div>;
}

export function Actions({ children }: { children: ReactNode }) {
  return <div className="mt-6 flex flex-wrap justify-between gap-3">{children}</div>;
}

export function StepIndicator({ step }: { step: number }) {
  const { t } = useLanguage();
  return <ol aria-label={t("Build your own bundle")} className="mb-6 flex flex-wrap gap-2">
    {["Family", "Select", "Review", "Checkout"].map((name, index) =>
      <li key={name} aria-current={index === step ? "step" : undefined}
        className={`rounded-full px-3 py-2 text-xs ${index === step ? "bg-ink text-white" : "bg-white"}`}>
        {index + 1}. {t(name)}
      </li>)}
  </ol>;
}
