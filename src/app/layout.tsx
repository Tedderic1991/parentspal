import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ParentsPal | Playground Pass",
  description: "Discover play spots and build a family playground pass. Interactive demo.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
