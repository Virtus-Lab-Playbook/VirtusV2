import { site } from "@/content/site";
import { Container, SectionHeader } from "./primitives";

/** Sonar sweep — abstract nautical chart imagery drawn with vector precision. */
function Sonar({ id }: { id: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-abyss-2 to-abyss">
      {/* Background cartographic grid */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-shelf-dim)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-shelf-dim)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-25"
      />
      <svg
        viewBox="0 0 240 130"
        className="relative h-full w-full"
        fill="none"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Concentric bathymetric range rings */}
        {[24, 48, 72, 96, 120].map((r) => (
          <circle
            key={r}
            cx="48"
            cy="124"
            r={r}
            stroke="var(--color-shelf)"
            strokeOpacity={0.35}
            strokeDasharray="2 4"
          />
        ))}

        {/* Sonar sweep beam */}
        <path
          d="M48 124 L 204 28"
          stroke={`url(#sonar-beam-${id})`}
          strokeWidth="1.5"
          strokeOpacity="0.85"
        />

        {/* Range ray */}
        <line
          x1="48"
          y1="124"
          x2="220"
          y2="80"
          stroke="var(--color-shelf-dim)"
          strokeOpacity="0.5"
        />

        <defs>
          <linearGradient
            id={`sonar-beam-${id}`}
            x1="48"
            y1="124"
            x2="204"
            y2="28"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--color-biolume)" stopOpacity="0" />
            <stop offset="0.6" stopColor="var(--color-biolume)" stopOpacity="0.4" />
            <stop offset="1" stopColor="var(--color-biolume)" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Target contact beacon */}
        <circle cx="188" cy="40" r="3" fill="var(--color-biolume)" />
        <circle
          cx="188"
          cy="40"
          r="7"
          stroke="var(--color-biolume)"
          strokeOpacity="0.45"
          className="animate-ping [animation-duration:3s]"
        />
      </svg>
    </div>
  );
}

export function Work() {
  return (
    <section id="work" className="scroll-mt-24 pt-24 pb-32 sm:pt-32 sm:pb-40">
      <Container>
        <SectionHeader
          title={site.work.title}
          intro={site.work.intro}
          depth="1600 m — bathypelagic"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {site.work.projects.map((proj) => (
            <article
              key={proj.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-shelf/80 bg-deep/50 transition-all duration-300 hover:-translate-y-1.5 hover:border-shelf hover:shadow-[0_24px_48px_-20px_rgba(49,224,190,0.14)]"
            >
              <div className="h-36 border-b border-shelf-dim/80">
                <Sonar id={proj.id} />
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="mb-3.5 flex items-center justify-between gap-2">
                  <span className="rounded-full border border-brass/40 bg-brass/10 px-2.5 py-0.5 text-[0.68rem] font-medium text-brass">
                    {proj.kind}
                  </span>
                  <span className="readout text-tide/80">{proj.depth}</span>
                </div>
                <h3 className="text-h3 font-sans font-semibold text-seaglass transition-colors duration-200 group-hover:text-biolume">
                  {proj.name}
                </h3>
                <p className="mt-1 text-[0.82rem] font-medium text-tide/75">{proj.pillar}</p>
                <p className="mt-3.5 flex-1 text-sm leading-relaxed text-tide">{proj.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
