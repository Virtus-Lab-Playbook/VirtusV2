import { NextResponse } from "next/server";
import {
  buildBriefEmailText,
  validateBriefSubmission,
} from "@/lib/brief-submission";

const RESEND_ENDPOINT =
  "https://api.resend.com/emails";

const MAX_REQUEST_BYTES = 20_000;

function unavailable() {
  return NextResponse.json(
    {
      ok: false,
      error:
        "Brief submission is temporarily unavailable.",
    },
    {
      status: 503,
    },
  );
}

export async function POST(
  request: Request,
) {
  const contentLength =
    request.headers.get(
      "content-length",
    );

  if (
    contentLength &&
    Number(contentLength) >
      MAX_REQUEST_BYTES
  ) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Submission is too large.",
      },
      {
        status: 413,
      },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Invalid submission.",
      },
      {
        status: 400,
      },
    );
  }

  /*
   * Honeypot.
   *
   * Real users never see or fill `website`.
   * If a bot fills it, return a neutral success
   * without sending an email.
   */
  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    typeof (
      body as {
        website?: unknown;
      }
    ).website === "string" &&
    (
      body as {
        website: string;
      }
    ).website.trim() !== ""
  ) {
    return NextResponse.json({
      ok: true,
    });
  }

  const validation =
    validateBriefSubmission(body);

  if (!validation.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: validation.error,
      },
      {
        status: 400,
      },
    );
  }

  const apiKey =
    process.env.RESEND_API_KEY;

  const fromEmail =
    process.env
      .VIRTUS_BRIEF_FROM_EMAIL;

  const toEmail =
    process.env
      .VIRTUS_BRIEF_TO_EMAIL;

  if (
    !apiKey ||
    !fromEmail ||
    !toEmail
  ) {
    console.error(
      "Brief submission is missing required server environment variables.",
    );

    return unavailable();
  }

  const submission =
    validation.value;

  const providerResponse =
    await fetch(
      RESEND_ENDPOINT,
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${apiKey}`,
          "Content-Type":
            "application/json",
          "User-Agent":
            "Virtus-Lab-Brief/1.0",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to:
            submission.email,
          subject:
            `Project brief — ${submission.name}`,
          text:
            buildBriefEmailText(
              submission,
            ),
        }),
        cache: "no-store",
      },
    ).catch((error) => {
      console.error(
        "Brief provider request failed.",
        error,
      );

      return null;
    });

  if (
    !providerResponse ||
    !providerResponse.ok
  ) {
    if (providerResponse) {
      const providerError =
        await providerResponse
          .text()
          .catch(() => "");

      console.error(
        "Brief provider rejected request.",
        providerResponse.status,
        providerError,
      );
    }

    return unavailable();
  }

  return NextResponse.json({
    ok: true,
  });
}
