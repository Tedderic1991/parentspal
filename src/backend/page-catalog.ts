import "server-only";
import { cache } from "react";
import { demoVenues } from "@/shared/catalog";
import { getVenueCatalog } from "./venues/repository";

export const getPageCatalog = cache(async () => {
  if (process.env.PARENTSPAL_BUILD_TARGET === "github-pages") {
    return { venues: demoVenues, mode: "demo" as const };
  }
  return getVenueCatalog();
});
