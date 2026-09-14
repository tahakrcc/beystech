import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "İletişim — Beystech",
  description:
    "Projenizi anlatın, 24 saat içinde dönüş yapalım. İlk görüşme her zaman ücretsiz.",
};

export default function IletisimPage() {
  return (
    <>
      <PageHeader page="contact" />
      <Contact hideHeader />
    </>
  );
}
