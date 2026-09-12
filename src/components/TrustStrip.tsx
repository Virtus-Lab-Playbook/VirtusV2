import { site } from "@/content/site";

export function TrustStrip() {
  return (
    <section
      aria-label="Studio credibility"
      className="border-y border-shelf/55 bg-abyss-2/96"
    >
      <div className="mx-auto grid max-w-[74rem] grid-cols-1 divide-y divide-shelf/50 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:pl-[calc(var(--rail-w)+2rem)] lg:pr-10">
        {site.trust.items.map((item, index) => (
          <div
            key={item.title}
            data-reveal
            className="grid grid-cols-[2rem_1fr] gap-3 py-6 sm:block sm:px-6 sm:py-7 sm:first:pl-0 sm:last:pr-0"
          >
            <span className="readout text-tide/80 sm:mb-4 sm:block">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.08em] text-seaglass">
                {item.title}
              </h2>
              <p className="mt-2 max-w-[30ch] text-[0.88rem] leading-relaxed text-tide">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
