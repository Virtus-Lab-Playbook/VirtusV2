import { Nav } from "@/components/Nav";
import { DepthRail } from "@/components/DepthRail";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { DisciplineMarquee } from "@/components/DisciplineMarquee";
import { Work } from "@/components/Work";
import { Services } from "@/components/Services";
import { DigitalProducts } from "@/components/DigitalProducts";
import { WhyUs } from "@/components/WhyUs";
import { Process } from "@/components/Process";
import { Engagements } from "@/components/Packages";
import { BriefBuilder } from "@/components/BriefBuilder";
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
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-seaglass focus:px-5 focus:py-2.5 focus:font-semibold focus:text-abyss focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-tide"
      >
        Skip to content
      </a>

      <DepthRail />
      <Nav />

      <main id="main" tabIndex={-1} className="relative z-[1] outline-none">
        <Hero />
        <TrustStrip />
        <DisciplineMarquee />
        <Work />
        <Services />
        <DigitalProducts />
        <WhyUs />
        <Process />
        <Engagements />
        <BriefBuilder />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
    </ExperienceProvider>
  );
}
