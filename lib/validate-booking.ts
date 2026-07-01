export type BookingFormData = {
  name: string;
  email: string;
  date: string;
  time: string;
  // Optional context carried over from the Project Discovery step
  // (lib/use-funnel-storage.ts). Entirely optional so a booking made
  // without going through Discovery first (e.g. a direct link) still
  // validates fine.
  goal?: string;
  businessStage?: string;
  moreInfo?: string;
};

export type BookingValidationResult =
  | { valid: true; data: BookingFormData }
  | { valid: false; errors: Partial<Record<keyof BookingFormData, string>> };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const BOOKING_TIME_SLOTS = [
  "09:00 AM",
  "10:30 AM",
  "01:00 PM",
  "02:30 PM",
  "04:00 PM",
] as const;

/**
 * Validates a consultation booking submission. Shared between the
 * BookingForm client component and the /api/schedule-consultation
 * route handler.
 */
export function validateBookingForm(input: unknown): BookingValidationResult {
  const errors: Partial<Record<keyof BookingFormData, string>> = {};

  const record = (input ?? {}) as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const email = typeof record.email === "string" ? record.email.trim() : "";
  const date = typeof record.date === "string" ? record.date.trim() : "";
  const time = typeof record.time === "string" ? record.time.trim() : "";

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length > 200) {
    errors.name = "Name must be under 200 characters.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!date) {
    errors.date = "Choose a date.";
  }

  if (!time || !BOOKING_TIME_SLOTS.includes(time as (typeof BOOKING_TIME_SLOTS)[number])) {
    errors.time = "Choose a time.";
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  const optionalField = (key: string, maxLength = 1000): string | undefined => {
    const value = record[key];
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    return trimmed.slice(0, maxLength);
  };

  return {
    valid: true,
    data: {
      name,
      email,
      date,
      time,
      goal: optionalField("goal", 100),
      businessStage: optionalField("businessStage", 100),
      moreInfo: optionalField("moreInfo"),
    },
  };
}
