import { site } from "@/content/site";

export function Announcement() {
  return (
    <div className="border-b border-shelf-dim bg-abyss-2">
      <div className="mx-auto flex max-w-[74rem] items-center justify-between gap-4 px-5 py-2 sm:px-8 lg:pl-[calc(var(--rail-w)+2rem)] lg:pr-10">
        <p className="text-[0.8rem] text-tide">
          <span
            aria-hidden
            className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-biolume align-middle shadow-[0_0_8px_1px_var(--color-biolume)]"
          />
          {site.announcement}
        </p>
      </div>
    </div>
  );
}
