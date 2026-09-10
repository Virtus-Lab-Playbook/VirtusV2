import { site } from "@/content/site";

export function TrustStrip() {
  return (
    <section className="border-y border-shelf-dim bg-abyss-2">
      <div className="mx-auto grid max-w-[74rem] grid-cols-1 divide-y divide-shelf-dim px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:pl-[calc(var(--rail-w)+2rem)] lg:pr-10">
        {site.trust.items.map((item) => (
          <p
            key={item}
            className="px-0 py-4 text-sm text-tide sm:px-6 sm:first:pl-0 sm:last:pr-0"
          >
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}
