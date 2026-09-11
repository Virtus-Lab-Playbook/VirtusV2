import { site } from "@/content/site";
import { Container } from "./primitives";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer id="footer" className="relative z-[1] border-t border-shelf-dim py-16">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-[24ch]">
            <Wordmark />
            <p className="mt-3 font-display text-lg italic text-tide">
              {site.footer.tagline}
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <a
              href={`mailto:${site.contactEmail}`}
              className="text-seaglass transition-colors hover:text-biolume"
            >
              {site.contactEmail}
            </a>
            <a href={site.legal.privacy} className="text-tide transition-colors hover:text-seaglass">
              Privacy Policy
            </a>
            <a href={site.legal.terms} className="text-tide transition-colors hover:text-seaglass">
              Terms of Service
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-1 border-t border-shelf-dim pt-6">
          <span className="readout">{site.footer.built}</span>
          <span className="text-[0.78rem] text-tide/75">
            © {new Date().getFullYear()} {site.name}. Concept work is labelled Lab Project.
          </span>
        </div>
      </Container>
    </footer>
  );
}
