import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { PUBLIC_SITE_URL } from "@/lib/site";
import { SpeedInsights } from "@vercel/speed-insights/next";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tempered Strength | Gym Programs That Actually Work",
  description:
    "Download Tempered Strength — nine structured strength & Olympic lifting programs (five free) for iOS. Smart exercise swapping, on-demand workouts, and training that adapts to your equipment.",
  metadataBase: new URL(PUBLIC_SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: PUBLIC_SITE_URL,
    title: "Tempered Strength | Gym Programs That Actually Work",
    description:
      "Download Tempered Strength — nine structured strength & Olympic lifting programs (five free) for iOS. Smart exercise swapping, on-demand workouts, and training that adapts to your equipment.",
    siteName: "Tempered Strength",
    images: [{ url: "/logo_stacked.svg" }],
  },
  twitter: {
    card: "summary",
    title: "Tempered Strength | Gym Programs That Actually Work",
    description:
      "Download Tempered Strength — nine structured strength & Olympic lifting programs (five free) for iOS. Smart exercise swapping, on-demand workouts, and training that adapts to your equipment.",
    images: ["/logo_stacked.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakarta.variable} ${jetbrainsMono.variable} antialiased font-[family-name:var(--font-jakarta)]`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
