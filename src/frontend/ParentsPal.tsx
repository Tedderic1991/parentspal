"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import type { DataMode, Venue } from "@/shared/types";
import { LanguageProvider, useLanguage } from "./i18n/LanguageProvider";
import { SiteShell } from "./components/SiteShell";
import { Explore, VenueDetails } from "./features/venues/Explore";
import { FamilyForm } from "./features/pass-builder/FamilyForm";
import { BundleSelection } from "./features/pass-builder/BundleSelection";
import { Review } from "./features/pass-builder/Review";
import { Checkout } from "./features/checkout/Checkout";
import { DemoAccount, MyPass, PurchaseConfirmation } from "./features/passes/PassViews";
import { VisitPlanner } from "./features/visits/VisitPlanner";
import { VisitConfirmation } from "./features/visits/VisitConfirmation";
import { createDemoPass, demoReducer, initialState, type Screen } from "./features/pass-builder/state";

export function ParentsPal(props: { venues: Venue[]; dataMode: DataMode }) {
  return <LanguageProvider><DemoApp {...props} /></LanguageProvider>;
}

function DemoApp({ venues, dataMode }: { venues: Venue[]; dataMode: DataMode }) {
  const [state, dispatch] = useReducer(demoReducer, venues, initialState);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    document.getElementById("content")?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.screen]);

  function go(screen: Screen) {
    setError(null);
    dispatch({ type: "navigate", screen });
  }
  function patch(value: Parameters<typeof demoReducer>[1] & { type: "patch" }) {
    dispatch(value);
  }
  const detail = venues.find(venue => venue.id === state.detailId);
  const visitVenue = venues.find(venue => venue.id === state.visit.venueId);

  function renderScreen() {
    switch (state.screen) {
      case "home": return <Explore venues={venues} onBuild={() => go("family")}
        onDetail={id => patch({ type: "patch", value: { detailId: id, screen: "detail" } })} />;
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
          } catch (error) {
            if (!(error instanceof Error)) throw error;
            setError(error.message);
          }
        }} />;
      case "passes": return <MyPass pass={state.pass} venues={venues}
        onExplore={() => go("home")} onBuild={() => go("family")} onPlan={() => go("booking")} />;
      case "account": return <DemoAccount name={state.name} email={state.email}
        onChange={value => patch({ type: "patch", value })} onDone={() => go("passes")} />;
      case "purchased":
        if (!state.pass) throw new Error("No purchased pass.");
        return <PurchaseConfirmation pass={state.pass} venues={venues}
          onAccount={() => go("account")} onPass={() => go("passes")} />;
      case "booking":
        if (!state.pass) throw new Error("No pass available to plan a visit.");
        return <VisitPlanner venues={venues} pass={state.pass} visit={state.visit}
          onChange={visit => patch({ type: "patch", value: { visit } })}
          onBack={() => go("passes")} onConfirm={walkIn => go(walkIn ? "walkin" : "booked")} />;
      case "walkin":
      case "booked":
        if (!state.pass || !visitVenue) throw new Error("No visit available to confirm.");
        return <VisitConfirmation pass={state.pass} venue={visitVenue} visit={state.visit}
          walkIn={state.screen === "walkin"} onPass={() => go("passes")} onExplore={() => go("home")} />;
    }
  }

  return <SiteShell dataMode={dataMode} onExplore={() => go("home")} onPass={() => go("passes")}>
    {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-red-800">{t(error)}</p>}
    {renderScreen()}
  </SiteShell>;
}
