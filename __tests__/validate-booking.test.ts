import { validateBookingForm } from "@/lib/validate-booking";

describe("validateBookingForm", () => {
  it("accepts a fully valid booking", () => {
    const result = validateBookingForm({
      name: "Jane Doe",
      email: "jane@example.com",
      date: "2026-11-13",
      time: "10:30 AM",
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data).toEqual({
        name: "Jane Doe",
        email: "jane@example.com",
        date: "2026-11-13",
        time: "10:30 AM",
      });
    }
  });

  it("rejects a missing date", () => {
    const result = validateBookingForm({
      name: "Jane Doe",
      email: "jane@example.com",
      date: "",
      time: "10:30 AM",
    });

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.date).toBeDefined();
    }
  });

  it("rejects a missing time selection", () => {
    const result = validateBookingForm({
      name: "Jane Doe",
      email: "jane@example.com",
      date: "2026-11-13",
      time: "",
    });

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.time).toBeDefined();
    }
  });

  it("rejects a time outside the allowed set", () => {
    const result = validateBookingForm({
      name: "Jane Doe",
      email: "jane@example.com",
      date: "2026-11-13",
      time: "11:45 PM",
    });

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.time).toBeDefined();
    }
  });

  it("rejects an invalid email", () => {
    const result = validateBookingForm({
      name: "Jane Doe",
      email: "not-an-email",
      date: "2026-11-13",
      time: "10:30 AM",
    });

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.email).toBeDefined();
    }
  });

  it("handles malformed input gracefully", () => {
    const result = validateBookingForm(undefined);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.name).toBeDefined();
      expect(result.errors.email).toBeDefined();
      expect(result.errors.date).toBeDefined();
      expect(result.errors.time).toBeDefined();
    }
  });

  it("passes through optional Discovery context fields when present", () => {
    const result = validateBookingForm({
      name: "Jane Doe",
      email: "jane@example.com",
      date: "2026-11-13",
      time: "10:30 AM",
      goal: "growth",
      businessStage: "scaling",
      moreInfo: "Need a new platform by Q3",
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.goal).toBe("growth");
      expect(result.data.businessStage).toBe("scaling");
      expect(result.data.moreInfo).toBe("Need a new platform by Q3");
    }
  });

  it("omits empty optional fields rather than including blank strings", () => {
    const result = validateBookingForm({
      name: "Jane Doe",
      email: "jane@example.com",
      date: "2026-11-13",
      time: "10:30 AM",
      goal: "   ",
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.goal).toBeUndefined();
    }
  });
});
