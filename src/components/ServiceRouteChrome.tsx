import Link from "next/link";
import { site } from "@/content/site";
import { Container } from "./primitives";
import { Wordmark } from "./Wordmark";

export function ServiceRouteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-shelf/55 bg-abyss/92 backdrop-blur-xl">
      <Container className="flex min-h-16 items-center justify-between gap-6">
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="shrink-0 transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide"
        >
          <Wordmark />
        </Link>

        <nav
          aria-label="Service navigation"
          className="flex items-center gap-3 sm:gap-5"
        >
          <Link
            href="/services"
            className="hidden text-sm font-medium text-seaglass transition-colors hover:text-tide sm:inline"
          >
            Services
          </Link>

          <Link
            href="/work"
            className="hidden text-sm font-medium text-tide transition-colors hover:text-seaglass md:inline"
          >
            Work
          </Link>

          <Link
            href="/#products"
            className="hidden text-sm font-medium text-tide transition-colors hover:text-seaglass lg:inline"
          >
            Products
          </Link>

          <Link
            href="/#brief"
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-seaglass px-4 py-2 text-sm font-semibold tracking-tight text-abyss transition-all duration-200 hover:-translate-y-0.5 hover:bg-tide active:translate-y-0 active:scale-[0.98]"
          >
            Build your brief
          </Link>
        </nav>
      </Container>
    </header>
  );
}

export function ServiceRouteFooter() {
  return (
    <footer className="border-t border-shelf/55 bg-abyss py-12 sm:py-14">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-[30ch] font-display text-xl leading-snug text-tide">
              {site.footer.tagline}
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link
                href="/"
                className="text-tide transition-colors hover:text-seaglass"
              >
                Home
              </Link>

              <Link
                href="/services"
                className="text-tide transition-colors hover:text-seaglass"
              >
                Services
              </Link>

              <Link
                href="/work"
                className="text-tide transition-colors hover:text-seaglass"
              >
                Work
              </Link>

              <Link
                href="/#brief"
                className="text-tide transition-colors hover:text-seaglass"
              >
                Start a project
              </Link>
            </div>

            <a
              href={`mailto:${site.contactEmail}`}
              className="text-sm font-medium text-seaglass transition-colors hover:text-tide"
            >
              {site.contactEmail}
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-shelf/55 pt-6">
          <p className="readout text-[0.66rem] text-tide/70">
            © {new Date().getFullYear()} {site.name}.
          </p>
        </div>
      </Container>
    </footer>
  );
}
