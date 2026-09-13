import { site } from "@/content/site";

function MarqueeGroup({ clone = false }: { clone?: boolean }) {
  return (
    <div
      className={`discipline-marquee__group ${
        clone ? "discipline-marquee__group--clone" : ""
      }`}
      aria-hidden={clone || undefined}
    >
      {site.services.pillars.map((pillar) => (
        <span
          key={`${clone ? "clone-" : ""}${pillar.id}`}
          className="discipline-marquee__item"
        >
          <span>{pillar.name}</span>
          <span aria-hidden className="discipline-marquee__diamond" />
        </span>
      ))}
    </div>
  );
}

export function DisciplineMarquee() {
  return (
    <section
      className="discipline-marquee"
      aria-label="Virtus Lab disciplines"
    >
      <div className="discipline-marquee__track">
        <MarqueeGroup />
        <MarqueeGroup clone />
      </div>
    </section>
  );
}
