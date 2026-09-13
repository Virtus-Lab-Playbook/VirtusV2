import { site } from "@/content/site";

export function TrustStrip() {
  return (
    <section aria-label="Studio Credibility" className="border-y border-shelf-dim/80 bg-abyss-2/90 backdrop-blur-sm">
      <div className="mx-auto grid max-w-[74rem] grid-cols-1 divide-y divide-shelf-dim/70 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:pl-[calc(var(--rail-w)+2rem)] lg:pr-10">
        {site.trust.items.map((item, idx) => (
          <div
            key={item}
            className="flex items-center gap-3 px-0 py-3.5 sm:py-4 sm:px-6 sm:first:pl-0 sm:last:pr-0"
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-brass/80 shadow-[0_0_6px_rgba(200,162,74,0.4)]"
            />
            <p className="text-[0.84rem] font-medium tracking-tight text-tide/90 sm:text-[0.86rem]">
              <span className="readout mr-2 text-[0.68rem] text-tide/80 sm:hidden">
                0{idx + 1}
              </span>
              {item}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
