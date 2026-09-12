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
import { ProgressiveImmersiveExperience } from "@/experience/ProgressiveImmersiveExperience";
import { ExperienceProvider } from "@/experience/ExperienceContext";
import { SECTION_DEPTHS } from "@/experience/experience-config";

export default function Home() {
  return (
    <ExperienceProvider>
      <ProgressiveImmersiveExperience />

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
          className="global-scroll-scene--hero bg-abyss"
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
          className="global-scroll-scene--services-portal"
        >
          <Services />
        </GlobalScrollScene>

        <GlobalScrollScene
          previousDepth={SECTION_DEPTHS.services}
          depth={SECTION_DEPTHS.products}
          nextDepth={SECTION_DEPTHS.whyUs}
          className="bg-seaglass"
        >
          <DigitalProducts />
        </GlobalScrollScene>

        <GlobalScrollScene
          previousDepth={SECTION_DEPTHS.products}
          depth={SECTION_DEPTHS.whyUs}
          nextDepth={SECTION_DEPTHS.process}
          mode="sticky-safe"
          className="bg-abyss"
        >
          <WhyUs />
        </GlobalScrollScene>

        <GlobalScrollScene
          previousDepth={SECTION_DEPTHS.whyUs}
          depth={SECTION_DEPTHS.process}
          nextDepth={SECTION_DEPTHS.engagements}
          className="bg-abyss-2"
        >
          <Process />
        </GlobalScrollScene>

        <GlobalScrollScene
          previousDepth={SECTION_DEPTHS.process}
          depth={SECTION_DEPTHS.engagements}
          nextDepth={SECTION_DEPTHS.brief}
          className="bg-shelf"
        >
          <Engagements />
        </GlobalScrollScene>

        <GlobalScrollScene
          previousDepth={SECTION_DEPTHS.engagements}
          depth={SECTION_DEPTHS.brief}
          nextDepth={SECTION_DEPTHS.faq}
          className="bg-abyss"
        >
          <BriefBuilder />
        </GlobalScrollScene>

        <GlobalScrollScene
          previousDepth={SECTION_DEPTHS.brief}
          depth={SECTION_DEPTHS.faq}
          nextDepth={SECTION_DEPTHS.finalCta}
          className="bg-abyss-2"
        >
          <Faq />
        </GlobalScrollScene>

        <GlobalScrollScene
          previousDepth={SECTION_DEPTHS.faq}
          depth={SECTION_DEPTHS.finalCta}
          nextDepth={SECTION_DEPTHS.footer}
          mode="terminal"
          className="global-scroll-scene--final-docking"
        >
          <FinalCta />
        </GlobalScrollScene>
      </main>

      <Footer />
    </ExperienceProvider>
  );
}
