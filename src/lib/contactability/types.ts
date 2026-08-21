export type ContactabilityLevel =
  | "DIRECT_CONTACT"
  | "PUBLIC_CONTACT"
  | "PLATFORM_ONLY"
  | "NO_CONTACT"
  | "UNKNOWN";

export interface ContactabilityResult {
  level: ContactabilityLevel;
  emails: string[];
  phones: string[];
  usernames: string[];
  confidence: number;
}