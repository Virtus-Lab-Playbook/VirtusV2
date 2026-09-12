import { site } from "@/content/site";
import { Container } from "./primitives";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer
      id="footer"
      className="relative z-[1] border-t border-shelf/55 bg-abyss py-14 sm:py-18"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-[34rem]">
            <Wordmark />
            <p className="mt-4 max-w-[28ch] font-display text-xl leading-snug text-tide">
              {site.footer.tagline}
            </p>
          </div>

          {site.footer.groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="readout readout-caps text-tide/70">
                {group.title}
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <a
                    key={`${group.title}-${link.label}`}
                    href={link.href}
                    className="text-sm text-seaglass/90 transition-colors hover:text-tide"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </nav>
          ))}
        </div>

        <div className="mt-12 grid gap-6 border-t border-shelf/55 pt-7 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="flex flex-col gap-2 text-sm">
            <a
              href={`mailto:${site.contactEmail}`}
              className="font-medium text-seaglass transition-colors hover:text-tide"
            >
              {site.contactEmail}
            </a>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-tide">
              <a href={site.legal.privacy} className="hover:text-seaglass">
                Privacy
              </a>
              <a href={site.legal.terms} className="hover:text-seaglass">
                Terms
              </a>
            </div>
          </div>

          <div className="sm:text-right">
            <p className="readout text-tide">{site.footer.built}</p>
            <p className="readout mt-1 text-[0.66rem] text-tide/70">
              © {new Date().getFullYear()} {site.name}. {site.footer.disclosure}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
