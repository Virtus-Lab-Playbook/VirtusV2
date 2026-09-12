"use client";

import { useMemo, useState } from "react";
import { site } from "@/content/site";
import { useExperience } from "@/experience/ExperienceContext";
import { Container } from "./primitives";

const { brief } = site;

type Answers = Record<string, string[]>;

export function BriefBuilder() {
  const { triggerSignal } = useExperience();
  const [answers, setAnswers] = useState<Answers>({});
  const [copied, setCopied] = useState(false);

  const toggle = (stepId: string, option: string, multi: boolean) => {
    setCopied(false);
    triggerSignal("brief-pulse");

    setAnswers((previous) => {
      const current = previous[stepId] ?? [];

      if (multi) {
        const next = current.includes(option)
          ? current.filter((item) => item !== option)
          : [...current, option];

        return { ...previous, [stepId]: next };
      }

      return {
        ...previous,
        [stepId]: current[0] === option ? [] : [option],
      };
    });
  };

  const lines = useMemo(
    () =>
      brief.steps
        .filter((step) => (answers[step.id] ?? []).length > 0)
        .map(
          (step) =>
            `${step.label}: ${(answers[step.id] ?? []).join(", ")}`,
        ),
    [answers],
  );

  const hasAnswers = lines.length > 0;

  const mailto = useMemo(() => {
    const body = [
      "Project brief",
      "",
      ...lines,
      "",
      "(Built with the Virtus Lab brief builder)",
    ].join("\n");

    return `mailto:${site.contactEmail}?subject=${encodeURIComponent(
      "Project brief",
    )}&body=${encodeURIComponent(body)}`;
  }, [lines]);

  const copy = async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.clipboard?.writeText
    ) {
      setCopied(false);
      return;
    }

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const answeredCount = useMemo(
    () =>
      brief.steps.filter(
        (step) => (answers[step.id] ?? []).length > 0,
      ).length,
    [answers],
  );

  return (
    <section
      id="brief"
      className="scroll-mt-24 border-y border-shelf/55 bg-abyss py-24 sm:py-32"
    >
      <Container>
        <header data-reveal className="mb-14 max-w-[52rem]">
          <span className="readout readout-caps text-tide">
            Project starter
          </span>

          <h2 className="mt-4 text-h2 text-seaglass">
            {brief.title}
          </h2>

          <p className="mt-4 max-w-[56ch] text-[1.02rem] leading-relaxed text-tide">
            {brief.intro}
          </p>

          <p className="mt-5 text-sm text-tide/80">
            {brief.productEscape.label}{" "}
            <a
              href={brief.productEscape.href}
              className="font-semibold text-seaglass underline decoration-shelf underline-offset-4 transition-colors hover:text-tide"
            >
              {brief.productEscape.action} →
            </a>
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <div className="flex flex-col gap-10">
            {brief.steps.map((step, index) => {
              const selected = answers[step.id] ?? [];
              const isAnswered = selected.length > 0;

              return (
                <fieldset
                  key={step.id}
                  data-reveal
                  className="relative border-t border-shelf/50 pt-6"
                >
                  <legend className="flex w-full flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="readout mr-1 text-[0.72rem] text-tide/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="font-sans text-lg font-semibold text-seaglass sm:text-xl">
                      {step.prompt}
                    </span>

                    <span className="readout text-[0.68rem] text-tide/70">
                      {step.hint}
                    </span>

                    {isAnswered ? (
                      <span className="readout ml-auto text-[0.66rem] text-seaglass">
                        answered
                      </span>
                    ) : null}
                  </legend>

                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {step.options.map((option) => {
                      const on = selected.includes(option);

                      return (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={on}
                          onClick={() =>
                            toggle(step.id, option, step.multi)
                          }
                          className={`min-h-11 rounded-full border px-4.5 py-2.5 text-sm font-medium tracking-tight transition-all duration-150 active:scale-[0.98] ${
                            on
                              ? "border-tide bg-tide/18 text-seaglass"
                              : "border-shelf/70 bg-transparent text-tide hover:border-tide hover:text-seaglass"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-shelf/70 bg-abyss-2/92 p-6 sm:p-7">
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="readout readout-caps text-seaglass">
                  {brief.summary.title}
                </p>

                <span className="readout text-[0.68rem] text-tide">
                  {answeredCount} / {brief.steps.length}
                </span>
              </div>

              {hasAnswers ? (
                <dl className="flex flex-col gap-3.5 border-t border-shelf/50 pt-4">
                  {brief.steps
                    .filter(
                      (step) =>
                        (answers[step.id] ?? []).length > 0,
                    )
                    .map((step) => (
                      <div key={step.id}>
                        <dt className="readout text-[0.64rem] uppercase tracking-[0.12em] text-tide/65">
                          {step.label}
                        </dt>
                        <dd className="mt-0.5 text-sm font-medium text-seaglass">
                          {(answers[step.id] ?? []).join(", ")}
                        </dd>
                      </div>
                    ))}
                </dl>
              ) : (
                <p className="border-t border-shelf/50 pt-4 text-sm leading-relaxed text-tide">
                  {brief.summary.empty}
                </p>
              )}

              <div className="mt-7 flex flex-col gap-3">
                {hasAnswers ? (
                  <a
                    href={mailto}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-seaglass px-5 py-3 text-sm font-semibold tracking-tight text-abyss transition-colors duration-200 hover:bg-tide active:scale-[0.98]"
                  >
                    {brief.summary.send}
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-full bg-shelf/35 px-5 py-3 text-sm font-medium tracking-tight text-tide/50"
                  >
                    {brief.summary.send}
                  </button>
                )}

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={copy}
                    disabled={!hasAnswers}
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-shelf bg-transparent px-4 py-2 text-sm font-medium text-tide transition-colors hover:border-tide hover:text-seaglass active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span>
                      {copied
                        ? brief.summary.copied
                        : brief.summary.copy}
                    </span>
                    <span className="sr-only" aria-live="polite">
                      {copied ? "Brief copied to clipboard" : ""}
                    </span>
                  </button>

                  {hasAnswers ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAnswers({});
                        setCopied(false);
                      }}
                      className="inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm text-tide/75 transition-colors hover:text-seaglass"
                    >
                      {brief.summary.reset}
                    </button>
                  ) : null}
                </div>
              </div>

              <p className="mt-4 text-[0.78rem] leading-relaxed text-tide/70">
                {brief.summary.note}
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
