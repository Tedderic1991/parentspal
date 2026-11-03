import { notFound } from "next/navigation";
import { getPageCatalog } from "@/backend/page-catalog";
import { ParentsPal } from "@/frontend/ParentsPal";
import { demoVenues } from "@/shared/catalog";
import { pagePaths, resolveRoute } from "@/shared/routes";

export function generateStaticParams() {
  return pagePaths(demoVenues).map(path => ({ path: path.split("/").filter(Boolean) }));
}

export default async function Page({ params }: {
  params: Promise<{ path?: string[] }>;
}) {
  const { venues } = await getPageCatalog();
  const route = resolveRoute((await params).path, venues);
  if (!route) notFound();
  return <ParentsPal route={route} />;
}
