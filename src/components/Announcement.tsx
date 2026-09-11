import { site } from "@/content/site";

export function Announcement() {
  return (
    <aside aria-label="Studio Notice" className="border-b border-shelf-dim/70 bg-abyss-2/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[74rem] items-center justify-between gap-4 px-5 py-2 sm:px-8 lg:pl-[calc(var(--rail-w)+2rem)] lg:pr-10">
        <div className="flex items-center gap-2.5 text-[0.78rem] text-tide/90">
          <span className="readout-caps inline-flex items-center gap-1.5 rounded-full border border-biolume/30 bg-biolume/10 px-2 py-0.5 text-[0.62rem] text-biolume">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-biolume shadow-[0_0_8px_1px_var(--color-biolume)]"
            />
            status
          </span>
          <span className="font-sans">{site.announcement}</span>
        </div>
      </div>
    </aside>
  );
}
