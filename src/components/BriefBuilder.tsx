"use client";

import { useMemo, useState } from "react";
import { site } from "@/content/site";
import { Container, GoldRule } from "./primitives";

const { brief } = site;
type Answers = Record<string, string[]>;

export function BriefBuilder() {
  const [answers, setAnswers] = useState<Answers>({});
  const [copied, setCopied] = useState(false);

  const toggle = (stepId: string, option: string, multi: boolean) => {
    setCopied(false);
    setAnswers((prev) => {
      const current = prev[stepId] ?? [];
      if (multi) {
        const next = current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option];
        return { ...prev, [stepId]: next };
      }
      return { ...prev, [stepId]: current[0] === option ? [] : [option] };
    });
  };

  const lines = useMemo(
    () =>
      brief.steps
        .filter((s) => (answers[s.id] ?? []).length > 0)
        .map((s) => `${s.label}: ${answers[s.id].join(", ")}`),
    [answers],
  );

  const hasAnswers = lines.length > 0;

  const mailto = useMemo(() => {
    const body = [
      "Here's what I'm after:",
      "",
      ...lines,
      "",
      "(Built with the tap-through brief on virtuslab.studio)",
    ].join("\n");
    return `mailto:${site.contactEmail}?subject=${encodeURIComponent(
      "Project brief",
    )}&body=${encodeURIComponent(body)}`;
  }, [lines]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const answeredCount = useMemo(
    () => brief.steps.filter((s) => (answers[s.id] ?? []).length > 0).length,
    [answers],
  );
  const totalSteps = brief.steps.length;

  return (
    <section id="brief" className="scroll-mt-24 border-y border-shelf-dim/80 bg-abyss-2/95 pt-28 pb-32 sm:pt-36 sm:pb-40">
      <Container>
        <header className="mb-14 max-w-[48ch]">
          <div className="mb-5 flex items-center gap-4">
            <GoldRule />
            <span className="readout inline-flex items-center gap-2 text-tide/90">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-biolume shadow-[0_0_8px_1px_var(--color-biolume)]"
              />
              2800 m — no light reaches here
            </span>
          </div>
          <h2 className="text-h2 text-seaglass">{brief.title}</h2>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-tide">{brief.intro}</p>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <div className="flex flex-col gap-10">
            {brief.steps.map((step, idx) => {
              const selected = answers[step.id] ?? [];
              const isAnswered = selected.length > 0;
              return (
                <fieldset key={step.id} className="relative">
                  <legend className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="readout text-tide/50 mr-1 text-[0.72rem]">
                      0{idx + 1}
                    </span>
                    <span className="text-h3 font-sans font-semibold text-seaglass">
                      {step.prompt}
                    </span>
                    <span className="readout text-tide/70 text-[0.72rem]">
                      {step.hint}
                    </span>
                    {isAnswered ? (
                      <span className="readout ml-auto text-[0.66rem] text-biolume">
                        ✓ answered
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
                          onClick={() => toggle(step.id, option, step.multi)}
                          className={`min-h-11 rounded-full border px-4.5 py-2.5 text-sm font-medium tracking-tight transition-all duration-150 active:scale-[0.98] ${
                            on
                              ? "border-biolume bg-biolume/15 text-seaglass shadow-[0_0_14px_-3px_var(--color-biolume)]"
                              : "border-shelf/70 bg-deep/20 text-tide hover:border-tide/60 hover:bg-deep/40 hover:text-seaglass"
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

          {/* Summary Panel */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl border border-shelf/80 bg-gradient-to-b from-deep/90 to-abyss-2/95 p-6 sm:p-7 shadow-[0_24px_60px_-24px_rgba(4,23,30,0.9)] backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between">
                <p className="readout text-[0.74rem] uppercase tracking-wider text-brass">
                  {brief.summary.title}
                </p>
                <span className="readout text-[0.7rem] text-biolume/80">
                  {answeredCount} of {totalSteps}
                </span>
              </div>

              {hasAnswers ? (
                <dl className="flex flex-col gap-3.5 border-t border-shelf-dim/80 pt-4">
                  {brief.steps
                    .filter((s) => (answers[s.id] ?? []).length > 0)
                    .map((s) => (
                      <div key={s.id}>
                        <dt className="readout text-[0.66rem] uppercase tracking-wider text-tide/60">
                          {s.label}
                        </dt>
                        <dd className="mt-0.5 text-sm font-medium text-seaglass">
                          {answers[s.id].join(", ")}
                        </dd>
                      </div>
                    ))}
                </dl>
              ) : (
                <p className="border-t border-shelf-dim/80 pt-4 text-sm text-tide">
                  {brief.summary.empty}
                </p>
              )}

              <div className="mt-7 flex flex-col gap-3">
                {hasAnswers ? (
                  <a
                    href={mailto}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-biolume px-5 py-3 text-sm font-medium tracking-tight text-abyss transition-all duration-200 hover:bg-seaglass hover:shadow-[0_0_24px_-4px_var(--color-biolume)] active:scale-[0.98]"
                  >
                    {brief.summary.send}
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-full bg-shelf-dim/60 px-5 py-3 text-sm font-medium tracking-tight text-tide/40"
                  >
                    {brief.summary.send}
                  </button>
                )}

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={copy}
                    disabled={!hasAnswers}
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-shelf bg-deep/30 px-4 py-2 text-sm font-medium text-tide transition-all duration-200 hover:border-tide hover:text-seaglass active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {copied ? brief.summary.copied : brief.summary.copy}
                  </button>
                  {hasAnswers ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAnswers({});
                        setCopied(false);
                      }}
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-transparent px-4 py-2 text-sm text-tide/70 transition-colors hover:text-seaglass"
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
          </div>
        </div>
      </Container>
    </section>
  );
}
