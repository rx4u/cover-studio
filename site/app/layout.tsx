import type { Metadata } from "next";
import { Geist, Geist_Mono, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

const schibsted = Schibsted_Grotesk({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--font-schibsted" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://cover-studio-site.vercel.app"),
  title: "cover-studio: live site in, covers out",
  description:
    "An open-source CLI that captures a real website and renders presentation covers in 18 proven patterns, at every size a channel needs.",
  openGraph: {
    title: "cover-studio",
    description: "Live site in. Covers out. An open-source CLI for presentation covers made from real captures.",
    images: ["/covers/s-og.webp"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${schibsted.variable} ${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
