import { validateContactForm } from "@/lib/validate-contact";

describe("validateContactForm", () => {
  it("accepts a fully valid submission", () => {
    const result = validateContactForm({
      name: "Jane Doe",
      email: "jane@example.com",
      details: "I'd like to discuss a new web platform.",
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data).toEqual({
        name: "Jane Doe",
        email: "jane@example.com",
        details: "I'd like to discuss a new web platform.",
      });
    }
  });

  it("trims whitespace from valid fields", () => {
    const result = validateContactForm({
      name: "  Jane Doe  ",
      email: "  jane@example.com  ",
      details: "  Hello there  ",
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.name).toBe("Jane Doe");
      expect(result.data.email).toBe("jane@example.com");
      expect(result.data.details).toBe("Hello there");
    }
  });

  it("rejects a missing name", () => {
    const result = validateContactForm({
      name: "",
      email: "jane@example.com",
      details: "Hello",
    });

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.name).toBeDefined();
    }
  });

  it("rejects an invalid email format", () => {
    const result = validateContactForm({
      name: "Jane Doe",
      email: "not-an-email",
      details: "Hello",
    });

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.email).toBeDefined();
    }
  });

  it("rejects missing project details", () => {
    const result = validateContactForm({
      name: "Jane Doe",
      email: "jane@example.com",
      details: "   ",
    });

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.details).toBeDefined();
    }
  });

  it("rejects a name over 200 characters", () => {
    const result = validateContactForm({
      name: "a".repeat(201),
      email: "jane@example.com",
      details: "Hello",
    });

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.name).toBeDefined();
    }
  });

  it("rejects details over 5000 characters", () => {
    const result = validateContactForm({
      name: "Jane Doe",
      email: "jane@example.com",
      details: "a".repeat(5001),
    });

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.details).toBeDefined();
    }
  });

  it("handles completely malformed input gracefully", () => {
    const result = validateContactForm(null);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.name).toBeDefined();
      expect(result.errors.email).toBeDefined();
      expect(result.errors.details).toBeDefined();
    }
  });

  it("reports all field errors simultaneously when all fields are invalid", () => {
    const result = validateContactForm({
      name: "",
      email: "bad-email",
      details: "",
    });

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(Object.keys(result.errors)).toHaveLength(3);
    }
  });
});
