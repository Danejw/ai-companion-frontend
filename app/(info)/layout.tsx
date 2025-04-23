import InfoHeader from "@/components/info-header"; // Import the new header
import InfoFooter from "@/components/info-footer"; // Import the new footer
import "../globals.css"; // Import global styles
import { Geist, Geist_Mono } from "next/font/google"; // Import fonts if needed globally

// Re-declare fonts if needed specifically for this layout, or ensure they are applied globally from root layout
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Basic metadata for info pages (can be overridden by specific pages)
export const metadata = {
  title: "Knolia - Information",
  description: "Learn more about Knolia",
};

export default function InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <InfoHeader />
          <main className="flex-1">{children}</main>
          <InfoFooter />
        </div>
      </body>
    </html>
  );
} 