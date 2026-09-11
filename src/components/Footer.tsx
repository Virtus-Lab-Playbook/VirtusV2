import { site } from "@/content/site";
import { Container } from "./primitives";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer id="footer" className="relative z-[1] border-t border-shelf-dim/80 py-16 sm:py-20">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-[26ch]">
            <Wordmark />
            <p className="mt-3.5 font-display text-lg italic text-tide/90">
              {site.footer.tagline}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 text-sm">
            <a
              href={`mailto:${site.contactEmail}`}
              className="font-medium text-seaglass transition-colors duration-200 hover:text-biolume focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-biolume"
            >
              {site.contactEmail}
            </a>
            <a
              href={site.legal.privacy}
              className="text-tide transition-colors duration-200 hover:text-seaglass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-biolume"
            >
              Privacy Policy
            </a>
            <a
              href={site.legal.terms}
              className="text-tide transition-colors duration-200 hover:text-seaglass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-biolume"
            >
              Terms of Service
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-shelf-dim/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="readout text-tide/80">{site.footer.built}</span>
          <span className="readout text-[0.72rem] text-tide/80">
            © {new Date().getFullYear()} {site.name}. Concept work is labelled Lab Project.
          </span>
        </div>
      </Container>
    </footer>
  );
}
