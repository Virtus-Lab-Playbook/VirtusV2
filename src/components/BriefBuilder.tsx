"use client";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { site } from "@/content/site";
import type {
  BriefAnswers,
} from "@/lib/brief-submission";
import { useExperience } from "@/experience/ExperienceContext";
import { Container } from "./primitives";

const { brief } = site;

type SubmissionStatus =
  | "idle"
  | "submitting"
  | "success"
  | "error";

type ContactState = {
  name: string;
  email: string;
  company: string;
  message: string;
};

const initialContact: ContactState = {
  name: "",
  email: "",
  company: "",
  message: "",
};

export function BriefBuilder() {
  const { triggerSignal } =
    useExperience();

  const [
    answers,
    setAnswers,
  ] =
    useState<BriefAnswers>({});

  const [
    contact,
    setContact,
  ] =
    useState<ContactState>(
      initialContact,
    );

  const [
    copied,
    setCopied,
  ] =
    useState(false);

  const [
    status,
    setStatus,
  ] =
    useState<SubmissionStatus>(
      "idle",
    );

  const [
    submissionError,
    setSubmissionError,
  ] =
    useState("");

  const resetSubmissionState = () => {
    if (
      status !== "submitting"
    ) {
      setStatus("idle");
      setSubmissionError("");
    }
  };

  const toggle = (
    stepId: string,
    option: string,
    multi: boolean,
  ) => {
    setCopied(false);
    resetSubmissionState();
    triggerSignal(
      "brief-pulse",
    );

    setAnswers((previous) => {
      const current =
        previous[stepId] ?? [];

      if (multi) {
        const next =
          current.includes(option)
            ? current.filter(
                (item) =>
                  item !== option,
              )
            : [
                ...current,
                option,
              ];

        return {
          ...previous,
          [stepId]: next,
        };
      }

      return {
        ...previous,
        [stepId]:
          current[0] === option
            ? []
            : [option],
      };
    });
  };

  const lines = useMemo(
    () =>
      brief.steps
        .filter(
          (step) =>
            (
              answers[
                step.id
              ] ?? []
            ).length > 0,
        )
        .map(
          (step) =>
            `${step.label}: ${(
              answers[
                step.id
              ] ?? []
            ).join(", ")}`,
        ),
    [answers],
  );

  const hasAnswers =
    lines.length > 0;

  const hasProjectNeed =
    (
      answers.need ?? []
    ).length > 0;

  const canSubmit =
    contact.name
      .trim()
      .length > 0 &&
    contact.email
      .trim()
      .length > 0 &&
    hasProjectNeed &&
    status !==
      "submitting" &&
    status !==
      "success";

  const copy = async () => {
    if (
      typeof navigator ===
        "undefined" ||
      !navigator.clipboard
        ?.writeText
    ) {
      setCopied(false);
      return;
    }

    try {
      const contactLines = [
        contact.name.trim()
          ? `Name: ${contact.name.trim()}`
          : null,
        contact.email.trim()
          ? `Email: ${contact.email.trim()}`
          : null,
        contact.company.trim()
          ? `Company: ${contact.company.trim()}`
          : null,
        contact.message.trim()
          ? `Note: ${contact.message.trim()}`
          : null,
      ].filter(Boolean);

      await navigator.clipboard.writeText(
        [
          ...lines,
          ...(contactLines.length
            ? [
                "",
                ...contactLines,
              ]
            : []),
        ].join("\n"),
      );

      setCopied(true);

      window.setTimeout(
        () =>
          setCopied(false),
        2000,
      );
    } catch {
      setCopied(false);
    }
  };

  const answeredCount =
    useMemo(
      () =>
        brief.steps.filter(
          (step) =>
            (
              answers[
                step.id
              ] ?? []
            ).length > 0,
        ).length,
      [answers],
    );

  const updateContact = (
    key:
      keyof ContactState,
    value: string,
  ) => {
    resetSubmissionState();

    setContact(
      (previous) => ({
        ...previous,
        [key]: value,
      }),
    );
  };

  const resetAll = () => {
    setAnswers({});
    setContact(
      initialContact,
    );
    setCopied(false);
    setStatus("idle");
    setSubmissionError("");
  };

  const submit = async (
    event:
      FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!canSubmit) {
      setStatus("error");
      setSubmissionError(
        brief.contact.required,
      );
      return;
    }

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    const website =
      String(
        formData.get(
          "website",
        ) ?? "",
      );

    setStatus(
      "submitting",
    );
    setSubmissionError("");

    try {
      const response =
        await fetch(
          "/api/brief",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name:
                contact.name,
              email:
                contact.email,
              company:
                contact.company,
              message:
                contact.message,
              answers,
              website,
              sourceUrl:
                typeof window !==
                "undefined"
                  ? window
                      .location
                      .href
                  : "",
            }),
          },
        );

      const result =
        (await response
          .json()
          .catch(
            () => null,
          )) as
          | {
              ok?: boolean;
              error?: string;
            }
          | null;

      if (
        !response.ok ||
        !result?.ok
      ) {
        throw new Error(
          result?.error ||
            brief.contact.error,
        );
      }

      setStatus("success");

      triggerSignal(
        "brief-pulse",
      );
    } catch (
      error
    ) {
      setStatus("error");

      setSubmissionError(
        error instanceof Error &&
          error.message
          ? error.message
          : brief.contact.error,
      );
    }
  };

  return (
    <section
      id="brief"
      className="scroll-mt-24 border-y border-shelf/55 bg-abyss pt-14 pb-24 sm:pt-16 sm:pb-28"
    >
      <Container>
        <header
          data-reveal
          className="mb-14 max-w-[52rem]"
        >
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
            {
              brief
                .productEscape
                .label
            }{" "}

            <a
              href={
                brief
                  .productEscape
                  .href
              }
              className="font-semibold text-seaglass underline decoration-shelf underline-offset-4 transition-colors hover:text-tide"
            >
              {
                brief
                  .productEscape
                  .action
              }{" "}
              →
            </a>
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <form
            id="brief-submission-form"
            onSubmit={submit}
            className="flex flex-col gap-10"
          >
            {brief.steps.map(
              (
                step,
                index,
              ) => {
                const selected =
                  answers[
                    step.id
                  ] ?? [];

                const isAnswered =
                  selected.length >
                  0;

                return (
                  <fieldset
                    key={
                      step.id
                    }
                    data-reveal
                    className="relative border-t border-shelf/50 pt-6"
                  >
                    <legend className="flex w-full flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="readout mr-1 text-[0.72rem] text-tide/60">
                        {String(
                          index +
                            1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <span className="font-sans text-lg font-semibold text-seaglass sm:text-xl">
                        {
                          step.prompt
                        }
                      </span>

                      <span className="readout text-[0.68rem] text-tide/70">
                        {
                          step.hint
                        }
                      </span>

                      {isAnswered ? (
                        <span className="readout ml-auto text-[0.66rem] text-seaglass">
                          answered
                        </span>
                      ) : null}
                    </legend>

                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {step.options.map(
                        (
                          option,
                        ) => {
                          const on =
                            selected.includes(
                              option,
                            );

                          return (
                            <button
                              key={
                                option
                              }
                              type="button"
                              aria-pressed={
                                on
                              }
                              onClick={() =>
                                toggle(
                                  step.id,
                                  option,
                                  step.multi,
                                )
                              }
                              className={`min-h-11 rounded-full border px-4.5 py-2.5 text-sm font-medium tracking-tight transition-all duration-150 active:scale-[0.98] ${
                                on
                                  ? "border-tide bg-tide/18 text-seaglass"
                                  : "border-shelf/70 bg-transparent text-tide hover:border-tide hover:text-seaglass"
                              }`}
                            >
                              {
                                option
                              }
                            </button>
                          );
                        },
                      )}
                    </div>
                  </fieldset>
                );
              },
            )}

            <fieldset
              data-reveal
              className="border-t border-shelf/50 pt-7"
            >
              <legend>
                <span className="readout readout-caps text-tide">
                  {
                    brief
                      .contact
                      .title
                  }
                </span>
              </legend>

              <p className="mt-3 max-w-[54ch] text-sm leading-relaxed text-tide/78">
                {
                  brief
                    .contact
                    .intro
                }
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="brief-contact-field">
                  <span className="brief-contact-field__label">
                    {
                      brief
                        .contact
                        .name
                    }
                  </span>

                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={
                      100
                    }
                    value={
                      contact.name
                    }
                    onChange={(
                      event,
                    ) =>
                      updateContact(
                        "name",
                        event
                          .target
                          .value,
                      )
                    }
                    className="brief-contact-field__control"
                  />
                </label>

                <label className="brief-contact-field">
                  <span className="brief-contact-field__label">
                    {
                      brief
                        .contact
                        .email
                    }
                  </span>

                  <input
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    maxLength={
                      254
                    }
                    value={
                      contact.email
                    }
                    onChange={(
                      event,
                    ) =>
                      updateContact(
                        "email",
                        event
                          .target
                          .value,
                      )
                    }
                    className="brief-contact-field__control"
                  />
                </label>

                <label className="brief-contact-field sm:col-span-2">
                  <span className="brief-contact-field__label flex items-center justify-between gap-4">
                    <span>
                      {
                        brief
                          .contact
                          .company
                      }
                    </span>

                    <span className="font-normal text-tide/55">
                      {
                        brief
                          .contact
                          .companyOptional
                      }
                    </span>
                  </span>

                  <input
                    name="company"
                    type="text"
                    autoComplete="organization"
                    maxLength={
                      120
                    }
                    value={
                      contact.company
                    }
                    onChange={(
                      event,
                    ) =>
                      updateContact(
                        "company",
                        event
                          .target
                          .value,
                      )
                    }
                    className="brief-contact-field__control"
                  />
                </label>

                <label className="brief-contact-field sm:col-span-2">
                  <span className="brief-contact-field__label flex items-center justify-between gap-4">
                    <span>
                      {
                        brief
                          .contact
                          .message
                      }
                    </span>

                    <span className="font-normal text-tide/55">
                      {
                        brief
                          .contact
                          .messageOptional
                      }
                    </span>
                  </span>

                  <textarea
                    name="message"
                    rows={5}
                    maxLength={
                      2000
                    }
                    value={
                      contact.message
                    }
                    onChange={(
                      event,
                    ) =>
                      updateContact(
                        "message",
                        event
                          .target
                          .value,
                      )
                    }
                    className="brief-contact-field__control brief-contact-field__textarea"
                  />
                </label>
              </div>

              <div
                className="brief-honeypot"
                aria-hidden="true"
              >
                <label>
                  Website
                  <input
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>
            </fieldset>
          </form>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-shelf/70 bg-abyss-2/92 p-6 sm:p-7">
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="readout readout-caps text-seaglass">
                  {
                    brief
                      .summary
                      .title
                  }
                </p>

                <span className="readout text-[0.68rem] text-tide">
                  {
                    answeredCount
                  }{" "}
                  /{" "}
                  {
                    brief
                      .steps
                      .length
                  }
                </span>
              </div>

              {hasAnswers ? (
                <dl className="flex flex-col gap-3.5 border-t border-shelf/50 pt-4">
                  {brief.steps
                    .filter(
                      (
                        step,
                      ) =>
                        (
                          answers[
                            step
                              .id
                          ] ??
                          []
                        )
                          .length >
                        0,
                    )
                    .map(
                      (
                        step,
                      ) => (
                        <div
                          key={
                            step.id
                          }
                        >
                          <dt className="readout text-[0.64rem] uppercase tracking-[0.12em] text-tide/65">
                            {
                              step.label
                            }
                          </dt>

                          <dd className="mt-0.5 text-sm font-medium text-seaglass">
                            {(
                              answers[
                                step
                                  .id
                              ] ??
                              []
                            ).join(
                              ", ",
                            )}
                          </dd>
                        </div>
                      ),
                    )}
                </dl>
              ) : (
                <p className="border-t border-shelf/50 pt-4 text-sm leading-relaxed text-tide">
                  {
                    brief
                      .summary
                      .empty
                  }
                </p>
              )}

              {status ===
              "success" ? (
                <div
                  className="brief-submit-state brief-submit-state--success mt-7"
                  role="status"
                >
                  <span
                    aria-hidden
                    className="brief-submit-state__mark"
                  >
                    ✓
                  </span>

                  <p className="font-semibold text-seaglass">
                    {
                      brief
                        .contact
                        .successTitle
                    }
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-tide">
                    {
                      brief
                        .contact
                        .successBody
                    }
                  </p>

                  <button
                    type="button"
                    onClick={
                      resetAll
                    }
                    className="mt-5 inline-flex min-h-10 items-center justify-center rounded-full border border-shelf px-4 py-2 text-sm font-medium text-tide transition-colors hover:border-tide hover:text-seaglass"
                  >
                    {
                      brief
                        .contact
                        .another
                    }
                  </button>
                </div>
              ) : (
                <div className="mt-7 flex flex-col gap-3">
                  <button
                    type="submit"
                    form="brief-submission-form"
                    disabled={
                      !canSubmit
                    }
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-seaglass px-5 py-3 text-sm font-semibold tracking-tight text-abyss transition-all duration-200 hover:bg-tide active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-shelf/35 disabled:text-tide/50"
                  >
                    {status ===
                    "submitting"
                      ? brief
                          .contact
                          .submitting
                      : brief
                          .contact
                          .submit}
                  </button>

                  {!canSubmit &&
                  status !==
                    "submitting" ? (
                    <p className="text-[0.75rem] leading-relaxed text-tide/65">
                      {
                        brief
                          .contact
                          .required
                      }
                    </p>
                  ) : null}

                  {status ===
                  "error" ? (
                    <p
                      className="brief-submit-error text-sm leading-relaxed"
                      role="alert"
                    >
                      {submissionError ||
                        brief
                          .contact
                          .error}
                    </p>
                  ) : null}

                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={
                        copy
                      }
                      disabled={
                        !hasAnswers
                      }
                      className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-shelf bg-transparent px-4 py-2 text-sm font-medium text-tide transition-colors hover:border-tide hover:text-seaglass active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <span>
                        {copied
                          ? brief
                              .summary
                              .copied
                          : brief
                              .summary
                              .copy}
                      </span>

                      <span
                        className="sr-only"
                        aria-live="polite"
                      >
                        {copied
                          ? "Brief copied to clipboard"
                          : ""}
                      </span>
                    </button>

                    {hasAnswers ||
                    contact.name ||
                    contact.email ||
                    contact.company ||
                    contact.message ? (
                      <button
                        type="button"
                        onClick={
                          resetAll
                        }
                        disabled={
                          status ===
                          "submitting"
                        }
                        className="inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm text-tide/75 transition-colors hover:text-seaglass disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {
                          brief
                            .summary
                            .reset
                        }
                      </button>
                    ) : null}
                  </div>
                </div>
              )}

              <p className="mt-4 text-[0.78rem] leading-relaxed text-tide/70">
                {
                  brief
                    .summary
                    .note
                }
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
