import { getVenueCatalog } from "@/backend/venues/repository";
import { ParentsPal } from "@/frontend/ParentsPal";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const catalog = await getVenueCatalog();
  return <ParentsPal venues={catalog.venues} dataMode={catalog.mode} />;
}
