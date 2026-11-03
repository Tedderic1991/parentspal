import type { Metadata } from "next";
import { connection } from "next/server";
import { getPageCatalog } from "@/backend/page-catalog";
import { DemoProvider } from "@/frontend/DemoProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "ParentsPal | Playground Pass",
  description: "Discover play spots and build a family playground pass. Interactive demo.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (process.env.PARENTSPAL_BUILD_TARGET !== "github-pages") await connection();
  const catalog = await getPageCatalog();
  return <html lang="en"><body>
    <DemoProvider venues={catalog.venues} dataMode={catalog.mode}>{children}</DemoProvider>
  </body></html>;
}
