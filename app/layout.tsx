import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { RenderOverlays } from "@/components/layout/RenderOverlays";
import Background from "@/components/Background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Persoanlized AI Companion",
  description: "The AI Companion for your life",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ClientProviders MUST wrap everything needing client context */}
        <ClientProviders>
          <Header /> {/* Header is inside Providers */}
          <main className="flex-1"> {/* Adjust pt-14 if header height changes */}
            {children}
          </main>
          <RenderOverlays /> {/* <-- Render the wrapper here, also inside Providers */}
        </ClientProviders>
      </body>
    </html>
  );
}