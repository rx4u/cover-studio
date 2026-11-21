import type { Metadata } from "next";
import { Geist, Geist_Mono, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

const schibsted = Schibsted_Grotesk({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--font-schibsted" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://cover-studio-cli.vercel.app"),
  title: "cover-studio: cover and mockup generator for designers",
  description:
    "Presentation covers and device mockups for designers who post their work. An open-source generator: 18 tested patterns, every size, real device frames.",
  openGraph: {
    title: "cover-studio",
    description: "Covers, done. Presentation covers and device mockups for designers who post their work.",
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
