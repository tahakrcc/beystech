import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beystech — Yazılım & Ürün Stüdyosu",
  description:
    "Beystech; web, mobil ve yapay zeka destekli ürünler geliştiren yazılım stüdyosu. Fikirden ölçeklenen ürüne kadar uçtan uca geliştirme.",
  keywords: [
    "yazılım ajansı",
    "web geliştirme",
    "mobil uygulama",
    "yapay zeka",
    "ürün stüdyosu",
    "Beystech",
  ],
  openGraph: {
    title: "Beystech — Yazılım & Ürün Stüdyosu",
    description:
      "Fikirden ölçeklenen ürüne kadar uçtan uca geliştirme. Web, mobil ve yapay zeka.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} grain antialiased`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
