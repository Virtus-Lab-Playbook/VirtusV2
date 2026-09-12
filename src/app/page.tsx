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
import { GlobalScrollScene } from "@/components/GlobalScrollScene";
import { ImmersiveExperience } from "@/experience/ImmersiveExperience";
import { ExperienceProvider } from "@/experience/ExperienceContext";
import { SECTION_DEPTHS } from "@/experience/experience-config";

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
        <GlobalScrollScene
          previousDepth={SECTION_DEPTHS.hero}
          depth={SECTION_DEPTHS.hero}
          nextDepth={SECTION_DEPTHS.work}
          mode="slide"
          className="global-scroll-scene--hero"
        >
          <Hero />
          <TrustStrip />
          <DisciplineMarquee />
        </GlobalScrollScene>

        <Work />

        <GlobalScrollScene
          previousDepth={SECTION_DEPTHS.work}
          depth={SECTION_DEPTHS.services}
          nextDepth={SECTION_DEPTHS.products}
        >
          <Services />
        </GlobalScrollScene>

        <GlobalScrollScene
          previousDepth={SECTION_DEPTHS.services}
          depth={SECTION_DEPTHS.products}
          nextDepth={SECTION_DEPTHS.whyUs}
        >
          <DigitalProducts />
        </GlobalScrollScene>

        <GlobalScrollScene
          previousDepth={SECTION_DEPTHS.products}
          depth={SECTION_DEPTHS.whyUs}
          nextDepth={SECTION_DEPTHS.process}
          mode="sticky-safe"
        >
          <WhyUs />
        </GlobalScrollScene>

        <GlobalScrollScene
          previousDepth={SECTION_DEPTHS.whyUs}
          depth={SECTION_DEPTHS.process}
          nextDepth={SECTION_DEPTHS.engagements}
        >
          <Process />
        </GlobalScrollScene>

        <GlobalScrollScene
          previousDepth={SECTION_DEPTHS.process}
          depth={SECTION_DEPTHS.engagements}
          nextDepth={SECTION_DEPTHS.brief}
        >
          <Engagements />
        </GlobalScrollScene>

        <GlobalScrollScene
          previousDepth={SECTION_DEPTHS.engagements}
          depth={SECTION_DEPTHS.brief}
          nextDepth={SECTION_DEPTHS.faq}
        >
          <BriefBuilder />
        </GlobalScrollScene>

        <GlobalScrollScene
          previousDepth={SECTION_DEPTHS.brief}
          depth={SECTION_DEPTHS.faq}
          nextDepth={SECTION_DEPTHS.finalCta}
        >
          <Faq />
        </GlobalScrollScene>

        <GlobalScrollScene
          previousDepth={SECTION_DEPTHS.faq}
          depth={SECTION_DEPTHS.finalCta}
          nextDepth={SECTION_DEPTHS.footer}
          mode="terminal"
        >
          <FinalCta />
        </GlobalScrollScene>
      </main>

      <Footer />
    </ExperienceProvider>
  );
}
