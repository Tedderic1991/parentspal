"use client";

import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import type { DataMode, Venue } from "@/shared/types";
import { LanguageProvider } from "./i18n/LanguageProvider";
import { demoReducer, initialState, type DemoAction, type DemoState } from "./features/pass-builder/state";

interface DemoContext {
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
  venues: Venue[];
  dataMode: DataMode;
}

const Context = createContext<DemoContext | null>(null);

export function DemoProvider({ venues, dataMode, children }: {
  venues: Venue[]; dataMode: DataMode; children: ReactNode;
}) {
  const [state, dispatch] = useReducer(demoReducer, venues, initialState);
  return <LanguageProvider>
    <Context.Provider value={{ state, dispatch, venues, dataMode }}>{children}</Context.Provider>
  </LanguageProvider>;
}

export function useDemo() {
  const context = useContext(Context);
  if (!context) throw new Error("useDemo requires DemoProvider.");
  return context;
}
