import Link from "next/link";
import { site } from "@/content/site";
import { Container } from "./primitives";
import { Wordmark } from "./Wordmark";

export function ProductRouteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-deep-2/25 bg-seaglass/94 text-abyss backdrop-blur-xl">
      <Container className="flex min-h-16 items-center justify-between gap-6">
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="shrink-0 text-abyss transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-2"
        >
          <Wordmark />
        </Link>

        <nav
          aria-label="Product navigation"
          className="flex items-center gap-3 sm:gap-5"
        >
          <Link
            href="/products"
            className="hidden text-sm font-medium text-abyss transition-opacity hover:opacity-65 sm:inline"
          >
            Products
          </Link>

          <Link
            href="/services"
            className="hidden text-sm font-medium text-deep-2 transition-colors hover:text-abyss md:inline"
          >
            Services
          </Link>

          <Link
            href="/work"
            className="hidden text-sm font-medium text-deep-2 transition-colors hover:text-abyss lg:inline"
          >
            Work
          </Link>

          <Link
            href="/#brief"
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-abyss px-4 py-2 text-sm font-semibold tracking-tight text-seaglass transition-all duration-200 hover:-translate-y-0.5 hover:bg-deep-2 active:translate-y-0 active:scale-[0.98]"
          >
            Build your brief
          </Link>
        </nav>
      </Container>
    </header>
  );
}

export function ProductRouteFooter() {
  return (
    <footer className="border-t border-deep-2/25 bg-seaglass py-12 text-abyss sm:py-14">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Wordmark />

            <p className="mt-4 max-w-[30ch] font-display text-xl leading-snug text-deep-2">
              {site.footer.tagline}
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link
                href="/"
                className="text-deep-2 transition-colors hover:text-abyss"
              >
                Home
              </Link>

              <Link
                href="/products"
                className="text-deep-2 transition-colors hover:text-abyss"
              >
                Products
              </Link>

              <Link
                href="/services"
                className="text-deep-2 transition-colors hover:text-abyss"
              >
                Services
              </Link>

              <Link
                href="/#brief"
                className="text-deep-2 transition-colors hover:text-abyss"
              >
                Start a project
              </Link>
            </div>

            <a
              href={`mailto:${site.contactEmail}`}
              className="text-sm font-medium text-abyss transition-opacity hover:opacity-65"
            >
              {site.contactEmail}
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-deep-2/25 pt-6">
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.1em] text-deep-2/70">
            © {new Date().getFullYear()} {site.name}.
          </p>
        </div>
      </Container>
    </footer>
  );
}
