import Link from "next/link";
import { site } from "@/content/site";
import { Container } from "@/components/primitives";
import { Wordmark } from "@/components/Wordmark";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-abyss text-seaglass">
      <Container className="flex min-h-screen flex-col justify-between py-8 sm:py-10">
        <div>
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide"
          >
            <Wordmark />
          </Link>
        </div>

        <div className="max-w-[58rem] py-20">
          <span className="readout readout-caps text-tide">
            404 · Not found
          </span>

          <h1 className="mt-5 max-w-[9ch] font-display text-[clamp(4rem,10vw,10rem)] leading-[0.86] tracking-[-0.05em] text-seaglass">
            This page is off the map.
          </h1>

          <p className="mt-7 max-w-[46ch] text-base leading-relaxed text-tide sm:text-lg">
            The page may have moved, changed, or never existed.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-seaglass px-6 py-3 text-sm font-semibold text-abyss transition-colors hover:bg-tide"
            >
              Return home
            </Link>

            <Link
              href="/work"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-shelf px-6 py-3 text-sm font-semibold text-seaglass transition-colors hover:border-tide hover:bg-deep-2"
            >
              View work
            </Link>
          </div>
        </div>

        <p className="readout text-[0.66rem] text-tide/65">
          {site.name} · {site.footer.built}
        </p>
      </Container>
    </main>
  );
}
