import { site } from "@/content/site";

export type BriefAnswers =
  Record<string, string[]>;

export type BriefSubmissionInput = {
  name: string;
  email: string;
  company?: string;
  message?: string;
  answers: BriefAnswers;
  website?: string;
  sourceUrl?: string;
};

export type ValidBriefSubmission = {
  name: string;
  email: string;
  company: string;
  message: string;
  answers: BriefAnswers;
  sourceUrl: string;
};

type ValidationResult =
  | {
      ok: true;
      value: ValidBriefSubmission;
    }
  | {
      ok: false;
      error: string;
    };

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function cleanSingleLine(
  value: unknown,
  maxLength: number,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (
    cleaned.length === 0 ||
    cleaned.length > maxLength
  ) {
    return null;
  }

  return cleaned;
}

function cleanOptionalSingleLine(
  value: unknown,
  maxLength: number,
): string {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "";
  }

  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanOptionalMessage(
  value: unknown,
  maxLength: number,
): string {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "";
  }

  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(
  value: string,
): boolean {
  return (
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value,
    )
  );
}

function validateAnswers(
  value: unknown,
):
  | {
      ok: true;
      answers: BriefAnswers;
    }
  | {
      ok: false;
      error: string;
    } {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Invalid brief answers.",
    };
  }

  const knownIds = new Set<string>(
    site.brief.steps.map(
      (step) => step.id,
    ),
  );

  for (const key of Object.keys(value)) {
    if (!knownIds.has(key)) {
      return {
        ok: false,
        error:
          "Invalid brief question.",
      };
    }
  }

  const answers: BriefAnswers = {};

  for (const step of site.brief.steps) {
    const raw = value[step.id];

    if (raw === undefined) {
      answers[step.id] = [];
      continue;
    }

    if (
      !Array.isArray(raw) ||
      !raw.every(
        (item) =>
          typeof item === "string",
      )
    ) {
      return {
        ok: false,
        error:
          "Invalid brief selection.",
      };
    }

    const unique = [
      ...new Set(raw),
    ];

    if (
      !step.multi &&
      unique.length > 1
    ) {
      return {
        ok: false,
        error:
          "Too many selections for a single-choice question.",
      };
    }

    const allowedOptions =
      step.options as readonly string[];

    for (const selected of unique) {
      if (
        !allowedOptions.includes(
          selected,
        )
      ) {
        return {
          ok: false,
          error:
            "Invalid brief option.",
        };
      }
    }

    answers[step.id] = unique;
  }

  if (
    (answers.need ?? []).length === 0
  ) {
    return {
      ok: false,
      error:
        "Select at least one project need.",
    };
  }

  return {
    ok: true,
    answers,
  };
}

export function validateBriefSubmission(
  input: unknown,
): ValidationResult {
  if (!isRecord(input)) {
    return {
      ok: false,
      error:
        "Invalid submission.",
    };
  }

  const name = cleanSingleLine(
    input.name,
    100,
  );

  if (!name) {
    return {
      ok: false,
      error:
        "Enter your name.",
    };
  }

  const email = cleanSingleLine(
    input.email,
    254,
  );

  if (
    !email ||
    !isValidEmail(email)
  ) {
    return {
      ok: false,
      error:
        "Enter a valid email address.",
    };
  }

  const answerResult =
    validateAnswers(input.answers);

  if (!answerResult.ok) {
    return answerResult;
  }

  const company =
    cleanOptionalSingleLine(
      input.company,
      120,
    );

  const message =
    cleanOptionalMessage(
      input.message,
      2000,
    );

  const sourceUrl =
    cleanOptionalSingleLine(
      input.sourceUrl,
      500,
    );

  return {
    ok: true,
    value: {
      name,
      email,
      company,
      message,
      answers:
        answerResult.answers,
      sourceUrl,
    },
  };
}

export function buildBriefEmailText(
  submission: ValidBriefSubmission,
): string {
  const answerLines =
    site.brief.steps.map((step) => {
      const selected =
        submission.answers[
          step.id
        ] ?? [];

      return `${step.label}: ${
        selected.length > 0
          ? selected.join(", ")
          : "Not answered"
      }`;
    });

  return [
    "New Virtus project brief",
    "",
    "CONTACT",
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Company: ${
      submission.company ||
      "Not provided"
    }`,
    "",
    "PROJECT BRIEF",
    ...answerLines,
    "",
    "ADDITIONAL NOTE",
    submission.message ||
      "Not provided",
    "",
    "SOURCE",
    submission.sourceUrl ||
      "Not provided",
    "",
    `Received: ${new Date().toISOString()}`,
  ].join("\n");
}
