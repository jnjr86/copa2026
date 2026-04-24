import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Copa do Mundo 2026",
  description: "Acompanhe todos os 104 jogos da Copa do Mundo 2026",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen" style={{ background: "var(--bg-base)" }}>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-8">
          {children}
        </main>
        {/* Mobile bottom safe area */}
        <div className="h-16 sm:hidden" />
      </body>
    </html>
  );
}
