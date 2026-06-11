import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import SwRegister from "@/components/SwRegister";

export const metadata: Metadata = {
  title: "FitPro — Treinos & Dieta",
  description: "Seu coach de treinos e dieta com IA. Experiência guiada, visual e motivadora.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FitPro",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body style={{ background: "#000", color: "#fff", overflow: "hidden" }} suppressHydrationWarning>
        <SwRegister />
        <main style={{
          position: "fixed",
          top: 0,
          bottom: "calc(64px + env(safe-area-inset-bottom, 0px))",
          left: 0,
          right: 0,
          maxWidth: 480,
          marginLeft: "auto",
          marginRight: "auto",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}>{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
