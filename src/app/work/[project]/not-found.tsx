import Link from "next/link";
import {
  WorkRouteFooter,
  WorkRouteNav,
} from "@/components/WorkRouteChrome";
import { Container } from "@/components/primitives";

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen bg-abyss text-seaglass">
      <WorkRouteNav />

      <main className="flex min-h-[70svh] items-center border-b border-shelf/55">
        <Container>
          <span className="readout readout-caps text-tide">
            404 · Work
          </span>

          <h1 className="mt-4 max-w-[10ch] font-display text-[clamp(3.5rem,8vw,8rem)] leading-[0.9] tracking-[-0.04em] text-seaglass">
            Project not found.
          </h1>

          <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-tide">
            This project is not available in the current portfolio.
          </p>

          <Link
            href="/work"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-seaglass px-6 py-3 text-sm font-semibold text-abyss transition-colors hover:bg-tide"
          >
            View all work
          </Link>
        </Container>
      </main>

      <WorkRouteFooter />
    </div>
  );
}
