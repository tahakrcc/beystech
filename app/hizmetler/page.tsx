import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Services from "@/components/Services";
import Process from "@/components/Process";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Hizmetler — Beystech",
  description:
    "Web platformları, mobil uygulama, yapay zeka, ürün tasarımı, backend ve danışmanlık. Beystech ile uçtan uca dijital ürün geliştirme.",
};

export default function HizmetlerPage() {
  return (
    <>
      <PageHeader page="services" />
      <Services hideHeader />
      <div className="border-t border-border" />
      <Process hideHeader />
      <CTABand />
    </>
  );
}
