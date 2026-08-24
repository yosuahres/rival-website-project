import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Resend will only accept a `from` address on a domain you have verified in
// the dashboard. `onboarding@resend.dev` is Resend's shared sender: it works
// without any verification, but it can only deliver to the email address that
// owns the Resend account. Set CONTACT_FROM_EMAIL once a real domain is
// verified so submissions reach the team inbox.
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "official.krtmiits@gmail.com";

// Caps on each field so a single submission can't be used to blast a
// megabyte-sized email through our Resend account.
const MAX_LENGTHS = {
  firstName: 100,
  lastName: 100,
  email: 254,
  message: 5000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Escape a value for interpolation into the HTML email body. Everything the
 * submitter controls ends up inside markup we send to the team inbox, so
 * without this a submission could inject arbitrary links or markup and turn
 * the contact form into a phishing relay.
 */
const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Read a required string field, rejecting non-strings and over-long values. */
const readField = (
  value: unknown,
  field: keyof typeof MAX_LENGTHS,
  { required }: { required: boolean },
): { value: string } | { error: string } => {
  if (value === undefined || value === null || value === "") {
    return required ? { error: `${field} is required` } : { value: "" };
  }
  if (typeof value !== "string") {
    return { error: `${field} must be text` };
  }
  const trimmed = value.trim();
  if (required && !trimmed) {
    return { error: `${field} is required` };
  }
  if (trimmed.length > MAX_LENGTHS[field]) {
    return {
      error: `${field} must be ${MAX_LENGTHS[field]} characters or fewer`,
    };
  }
  return { value: trimmed };
};

const failure = () =>
  NextResponse.json(
    { error: "Failed to send email. Please try again later." },
    { status: 500 },
  );

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Contact form is missing RESEND_API_KEY");
      return failure();
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }
    if (typeof body !== "object" || body === null) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const raw = body as Record<string, unknown>;
    const fields = {
      firstName: readField(raw.firstName, "firstName", { required: true }),
      lastName: readField(raw.lastName, "lastName", { required: false }),
      email: readField(raw.email, "email", { required: true }),
      message: readField(raw.message, "message", { required: true }),
    };

    for (const result of Object.values(fields)) {
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
    }

    const firstName = (fields.firstName as { value: string }).value;
    const lastName = (fields.lastName as { value: string }).value;
    const email = (fields.email as { value: string }).value;
    const message = (fields.message as { value: string }).value;

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    const fullName = lastName ? `${firstName} ${lastName}` : firstName;
    // Collapse newlines so a crafted name can't inject extra mail headers.
    const subject = `New Contact Form Submission from ${fullName}`.replace(
      /[\r\n]+/g,
      " ",
    );

    const safeName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #398561; border-bottom: 2px solid #398561; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
        </div>

        <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Message</h3>
          <p style="line-height: 1.6; color: #555;">${safeMessage}</p>
        </div>

        <div style="margin-top: 20px; padding: 15px; background-color: #e8f5e8; border-radius: 8px;">
          <p style="margin: 0; color: #398561; font-size: 14px;">
            <strong>Note:</strong> This message was sent through the RIVAL ITS website contact form.
          </p>
        </div>
      </div>
    `;

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject,
      html,
      text: `Name: ${fullName}\nEmail: ${email}\n\n${message}`,
      replyTo: email,
    });

    // Resend reports delivery problems in the response body rather than by
    // throwing, so this branch is what catches an unverified sender or a
    // rejected API key. Keep the detail in the logs, not in the response.
    if (error) {
      console.error("Resend error:", error);
      return failure();
    }

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return failure();
  }
}
