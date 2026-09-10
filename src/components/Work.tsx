import { site } from "@/content/site";
import { Container, SectionHeader } from "./primitives";

/** Sonar sweep — the one place work gets a piece of imagery, drawn not photographed. */
function Sonar({ id }: { id: string }) {
  return (
    <svg
      viewBox="0 0 200 120"
      className="h-full w-full"
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      {[18, 34, 50, 66].map((r) => (
        <circle
          key={r}
          cx="40"
          cy="112"
          r={r}
          stroke="var(--color-shelf)"
          strokeOpacity={0.4}
        />
      ))}
      <path
        d="M40 112 L 168 30"
        stroke={`url(#sonar-beam-${id})`}
        strokeOpacity="0.8"
      />
      <defs>
        <linearGradient id={`sonar-beam-${id}`} x1="40" y1="112" x2="168" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-biolume)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--color-biolume)" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <circle cx="150" cy="42" r="2.5" fill="var(--color-biolume)" />
    </svg>
  );
}

export function Work() {
  return (
    <section id="work" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <SectionHeader
          title={site.work.title}
          intro={site.work.intro}
          depth="1600 m — bathypelagic"
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {site.work.projects.map((proj) => (
            <article
              key={proj.id}
              className="group flex flex-col overflow-hidden rounded-lg border border-shelf bg-deep transition-all duration-300 hover:-translate-y-1 hover:border-biolume-dim hover:shadow-[0_20px_44px_-20px_var(--color-biolume-dim)]"
            >
              <div className="h-32 border-b border-shelf-dim bg-abyss-2 transition-colors duration-300 group-hover:bg-abyss">
                <Sonar id={proj.id} />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded-full border border-brass/40 bg-brass/5 px-2.5 py-0.5 text-[0.68rem] font-medium text-brass">
                    {proj.kind}
                  </span>
                  <span className="readout">{proj.depth}</span>
                </div>
                <h3 className="text-h3 font-sans font-semibold tracking-normal">
                  {proj.name}
                </h3>
                <p className="mt-1 text-[0.8rem] text-tide/70">{proj.pillar}</p>
                <p className="mt-3 text-sm text-tide">{proj.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
