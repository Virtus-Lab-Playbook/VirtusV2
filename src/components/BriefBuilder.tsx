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

  return (
    <section id="brief" className="scroll-mt-24 border-y border-shelf-dim bg-abyss-2 py-24 sm:py-32">
      <Container>
        <header className="mb-12 max-w-[46ch]">
          <div className="mb-5 flex items-center gap-4">
            <GoldRule />
            <span className="readout">2800 m — no light reaches here</span>
          </div>
          <h2 className="text-h2">{brief.title}</h2>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-tide">{brief.intro}</p>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <div className="flex flex-col gap-10">
            {brief.steps.map((step) => {
              const selected = answers[step.id] ?? [];
              return (
                <fieldset key={step.id}>
                  <legend className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-h3 font-sans font-semibold tracking-normal">
                      {step.prompt}
                    </span>
                    <span className="readout text-tide/75">{step.hint}</span>
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
                          className={`min-h-11 rounded-full border px-4 py-2 text-sm transition-all duration-200 ${
                            on
                              ? "border-biolume bg-biolume/12 text-seaglass shadow-[0_0_16px_-4px_var(--color-biolume)]"
                              : "border-shelf text-tide hover:border-tide hover:text-seaglass"
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

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-shelf bg-gradient-to-b from-deep to-abyss-2 p-6 shadow-[0_24px_60px_-30px_var(--color-abyss)]">
              <p className="readout mb-4 text-brass">{brief.summary.title}</p>

              {hasAnswers ? (
                <dl className="flex flex-col gap-3 border-t border-shelf-dim pt-4">
                  {brief.steps
                    .filter((s) => (answers[s.id] ?? []).length > 0)
                    .map((s) => (
                      <div key={s.id}>
                        <dt className="text-[0.7rem] uppercase tracking-wider text-tide/75">
                          {s.label}
                        </dt>
                        <dd className="text-sm text-seaglass">
                          {answers[s.id].join(", ")}
                        </dd>
                      </div>
                    ))}
                </dl>
              ) : (
                <p className="border-t border-shelf-dim pt-4 text-sm text-tide">
                  {brief.summary.empty}
                </p>
              )}

              <div className="mt-6 flex flex-col gap-2.5">
                {hasAnswers ? (
                  <a
                    href={mailto}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-biolume px-5 py-3 text-sm font-medium text-abyss transition-colors hover:bg-seaglass"
                  >
                    {brief.summary.send}
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-full bg-shelf-dim px-5 py-3 text-sm font-medium text-tide/50"
                  >
                    {brief.summary.send}
                  </button>
                )}

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={copy}
                    disabled={!hasAnswers}
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-shelf px-4 py-2 text-sm text-tide transition-colors hover:border-tide hover:text-seaglass disabled:cursor-not-allowed disabled:opacity-40"
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
                      className="inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm text-tide/70 transition-colors hover:text-seaglass"
                    >
                      {brief.summary.reset}
                    </button>
                  ) : null}
                </div>
              </div>

              <p className="mt-4 text-[0.78rem] leading-relaxed text-tide/75">
                {brief.summary.note}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
