import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Team from "@/components/Team";
import Process from "@/components/Process";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Ekip — Beystech",
  description:
    "Beystech'in arkasındaki ekip ve çalışma şeklimiz. Aracı katman yok; doğrudan geliştiricilerle çalışırsınız.",
};

export default function EkipPage() {
  return (
    <>
      <PageHeader page="team" />
      <Team hideHeader />
      <div className="border-t border-border" />
      <Process hideHeader />
      <CTABand variant="team" />
    </>
  );
}
