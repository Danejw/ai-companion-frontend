import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Header from "@/components/header";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { RenderOverlays } from "@/components/layout/RenderOverlays";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Knolia",
  description: "The Personalized AI Companion for your life",
  manifest: "/manifest.json", // 👈 this registers your manifest for PWA

};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ClientProviders MUST wrap everything needing client context */}
        <ClientProviders>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <RenderOverlays />
        </ClientProviders>
      </body>
    </html>
  );
}