import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import Work from "@/components/Work";
import HomeStats from "@/components/HomeStats";
import CTABand from "@/components/CTABand";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Services />
      <HomeStats />
      <Work />
      <CTABand />
    </>
  );
}
