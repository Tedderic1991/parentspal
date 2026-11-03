"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { screenPaths, type PageRoute } from "@/shared/routes";
import { useLanguage } from "./i18n/LanguageProvider";
import { useDemo } from "./DemoProvider";
import { SiteShell } from "./components/SiteShell";
import { Button, Heading, Panel } from "./components/ui";
import { Explore, VenueDetails } from "./features/venues/Explore";
import { FamilyForm } from "./features/pass-builder/FamilyForm";
import { BundleSelection } from "./features/pass-builder/BundleSelection";
import { Review } from "./features/pass-builder/Review";
import { Checkout } from "./features/checkout/Checkout";
import { DemoAccount, MyPass, PurchaseConfirmation } from "./features/passes/PassViews";
import { VisitPlanner } from "./features/visits/VisitPlanner";
import { VisitConfirmation } from "./features/visits/VisitConfirmation";
import { createDemoPass, type DemoAction } from "./features/pass-builder/state";

export function ParentsPal({ route }: { route: PageRoute }) {
  const { state, dispatch, venues, dataMode } = useDemo();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    document.getElementById("content")?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [route]);

  function go(screen: keyof typeof screenPaths) {
    setError(null);
    router.push(screenPaths[screen]);
  }
  function patch(value: DemoAction & { type: "patch" }) {
    dispatch(value);
  }
  const detail = route.screen === "detail" ? venues.find(venue => venue.id === route.venueId) : undefined;
  const confirmedVisit = state.confirmedVisit;
  const visitVenue = venues.find(venue => venue.id === confirmedVisit?.venueId);

  function showPass() {
    return <MyPass pass={state.pass} venues={venues}
      onExplore={() => go("home")} onBuild={() => go("family")} onPlan={() => go("booking")} />;
  }

  function renderScreen() {
    switch (route.screen) {
      case "home": return <Explore venues={venues} onBuild={() => go("family")} />;
      case "detail":
        if (!detail) throw new Error("Unknown venue.");
        return <VenueDetails venue={detail} onBack={() => go("home")} onBuild={() => go("family")} />;
      case "family": return <FamilyForm family={state.family}
        onChange={family => patch({ type: "patch", value: { family } })}
        onBack={() => go("home")} onNext={() => go("select")} />;
      case "select": return <BundleSelection venues={venues} quantities={state.quantities}
        onQuantity={(venueId, delta) => dispatch({ type: "quantity", venueId, delta })}
        onBack={() => go("family")} onNext={() => go("review")} />;
      case "review": return <Review venues={venues} quantities={state.quantities}
        onBack={() => go("select")} onNext={() => go("checkout")} />;
      case "checkout": return <Checkout venues={venues} quantities={state.quantities}
        gift={state.family.gift} email={state.email} name={state.name} payment={state.payment}
        onChange={value => patch({ type: "patch", value })}
        onBack={() => go("review")} onPurchase={() => {
          try {
            const pass = createDemoPass(state, venues, new Date(), `PP-DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`);
            dispatch({ type: "purchase", pass });
            go("purchased");
          } catch (error) {
            if (!(error instanceof Error)) throw error;
            setError(error.message);
          }
        }} />;
      case "passes": return showPass();
      case "account": return <DemoAccount name={state.name} email={state.email}
        onChange={value => patch({ type: "patch", value })} onDone={() => go("passes")} />;
      case "purchased":
        if (!state.pass) return showPass();
        return <PurchaseConfirmation pass={state.pass} venues={venues}
          onAccount={() => go("account")} onPass={() => go("passes")} />;
      case "booking":
        if (!state.pass) return showPass();
        return <VisitPlanner venues={venues} pass={state.pass} visit={state.visit}
          onChange={visit => patch({ type: "patch", value: { visit } })}
          onBack={() => go("passes")} onConfirm={walkIn => {
            patch({ type: "patch", value: { confirmedVisit: { ...state.visit, walkIn } } });
            go(walkIn ? "walkin" : "booked");
          }} />;
      case "walkin":
      case "booked":
        if (!state.pass) return showPass();
        if (!confirmedVisit || !visitVenue || confirmedVisit.walkIn !== (route.screen === "walkin")) {
          return <Panel>
            <Heading eyebrow="Visit planning" title="No confirmed visit"
              description="Plan a demo visit before viewing its confirmation." />
            <Button onClick={() => go("booking")}>{t("Plan a visit")}</Button>
          </Panel>;
        }
        return <VisitConfirmation pass={state.pass} venue={visitVenue} visit={confirmedVisit}
          walkIn={confirmedVisit.walkIn} onPass={() => go("passes")} onExplore={() => go("home")} />;
    }
  }

  return <SiteShell dataMode={dataMode}>
    {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-red-800">{t(error)}</p>}
    {renderScreen()}
  </SiteShell>;
}
