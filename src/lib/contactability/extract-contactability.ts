import type {
  ContactabilityResult,
} from "./types";

const EMAIL_REGEX =
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

const PHONE_REGEX =
  /(?:\+?\d[\d\s().-]{7,}\d)/g;

const USERNAME_REGEX =
  /(?:u\/|@)([A-Za-z0-9_-]{2,30})/g;

export function extractContactability(
  text: string,
  author?: string | null
): ContactabilityResult {
  const safeText = text ?? "";

  const emails = Array.from(
    new Set(
      (safeText.match(EMAIL_REGEX) ?? [])
        .map((email) => email.trim().toLowerCase())
    )
  );

  const phones = Array.from(
    new Set(
      (safeText.match(PHONE_REGEX) ?? [])
        .map((phone) => phone.trim())
    )
  );

  const usernames = Array.from(
    new Set(
      Array.from(
        safeText.matchAll(USERNAME_REGEX)
      ).map((match) => match[1])
    )
  );

  if (author?.trim()) {
    const normalizedAuthor =
      author.trim().replace(/^u\//i, "");

    if (
      normalizedAuthor &&
      !usernames.includes(normalizedAuthor)
    ) {
      usernames.push(normalizedAuthor);
    }
  }

  let level: ContactabilityResult["level"];

  if (emails.length > 0 || phones.length > 0) {
    level = "DIRECT_CONTACT";
  } else if (usernames.length > 0) {
    level = "PLATFORM_ONLY";
  } else {
    level = "NO_CONTACT";
  }

  const confidence =
    level === "DIRECT_CONTACT"
      ? 100
      : level === "PLATFORM_ONLY"
        ? 70
        : 30;

  return {
    level,
    emails,
    phones,
    usernames,
    confidence,
  };
}