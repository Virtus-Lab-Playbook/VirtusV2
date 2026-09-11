import { Announcement } from "@/components/Announcement";
import { Nav } from "@/components/Nav";
import { DepthRail } from "@/components/DepthRail";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { Contour } from "@/components/Contour";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { Work } from "@/components/Work";
import { WhyUs } from "@/components/WhyUs";
import { BriefBuilder } from "@/components/BriefBuilder";
import { Packages } from "@/components/Packages";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { ImmersiveExperience } from "@/experience/ImmersiveExperience";
import { ExperienceProvider } from "@/experience/ExperienceContext";

export default function Home() {
  return (
    <ExperienceProvider>
      <ImmersiveExperience />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-biolume focus:px-4 focus:py-2 focus:text-abyss"
      >
        Skip to content
      </a>

      <DepthRail />
      <Announcement />
      <Nav />

      <main id="main" className="relative z-[1]">
        <Hero />
        <TrustStrip />
        <Contour animate />
        <Services />
        <Process />
        <Work />
        <WhyUs />
        <Contour />
        <BriefBuilder />
        <Packages />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
    </ExperienceProvider>
  );
}
