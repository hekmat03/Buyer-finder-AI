import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuyerFinder AI",
  description:
    "Discover and qualify real, recent, publicly available buying-intent opportunities for web development and AI services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
