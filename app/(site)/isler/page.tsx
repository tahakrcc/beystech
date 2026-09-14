import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Work from "@/components/Work";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "İşler — Beystech",
  description:
    "Yayına aldığımız fintech, SaaS, yapay zeka ve e-ticaret projelerinden seçmeler.",
};

export default function IslerPage() {
  return (
    <>
      <PageHeader page="work" />
      <Work hideHeader />
      <CTABand variant="work" />
    </>
  );
}
