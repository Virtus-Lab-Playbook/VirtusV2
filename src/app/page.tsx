import { ExperienceProvider } from "@/experience/ExperienceContext";
import { Nav } from "@/components/Nav";
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

export default function Home() {
  return (
    <ExperienceProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-seaglass focus:px-5 focus:py-2.5 focus:font-semibold focus:text-abyss focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-tide"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main" tabIndex={-1} className="relative z-[1] outline-none">
        <section className="bg-abyss">
          <Hero />
          <TrustStrip />
          <DisciplineMarquee />
        </section>

        <Work />

        <section className="bg-abyss">
          <Services />
        </section>

        <section className="bg-seaglass text-abyss">
          <DigitalProducts />
        </section>

        <section className="bg-abyss">
          <WhyUs />
        </section>

        <section className="bg-abyss-2">
          <Process />
        </section>

        <section className="bg-shelf">
          <Engagements />
        </section>

        <section className="bg-abyss">
          <BriefBuilder />
        </section>

        <section className="bg-abyss-2">
          <Faq />
        </section>

        <section className="bg-seaglass text-abyss">
          <FinalCta />
        </section>
      </main>

      <Footer />
    </ExperienceProvider>
  );
}
