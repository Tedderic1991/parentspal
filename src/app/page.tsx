import { connection } from "next/server";
import { getVenueCatalog } from "@/backend/venues/repository";
import { ParentsPal } from "@/frontend/ParentsPal";
import { demoVenues } from "@/shared/catalog";

export default async function HomePage() {
  if (process.env.PARENTSPAL_BUILD_TARGET === "github-pages") {
    return <ParentsPal venues={demoVenues} dataMode="demo" />;
  }
  await connection();
  const catalog = await getVenueCatalog();
  return <ParentsPal venues={catalog.venues} dataMode={catalog.mode} />;
}
