export type ContactFormData = {
  name: string;
  email: string;
  details: string;
};

export type ValidationResult =
  | { valid: true; data: ContactFormData }
  | { valid: false; errors: Partial<Record<keyof ContactFormData, string>> };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates raw contact form input. Shared between the API route
 * (server-side, authoritative) and could be reused client-side for
 * inline validation if desired.
 */
export function validateContactForm(input: unknown): ValidationResult {
  const errors: Partial<Record<keyof ContactFormData, string>> = {};

  const record = (input ?? {}) as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const email = typeof record.email === "string" ? record.email.trim() : "";
  const details =
    typeof record.details === "string" ? record.details.trim() : "";

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length > 200) {
    errors.name = "Name must be under 200 characters.";
  }

  if (!email) {
    errors.email = "Business email is required.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!details) {
    errors.details = "Project details are required.";
  } else if (details.length > 5000) {
    errors.details = "Project details must be under 5000 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data: { name, email, details } };
}
