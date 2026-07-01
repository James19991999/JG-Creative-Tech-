import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingForm } from "@/components/BookingForm";

describe("BookingForm", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    sessionStorage.clear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders the calendar grid with day 13 selected by default", () => {
    render(<BookingForm />);

    const day13 = screen.getByRole("button", { name: "13" });
    expect(day13).toHaveAttribute("aria-pressed", "true");
  });

  it("renders available time slots", () => {
    render(<BookingForm />);

    expect(screen.getByRole("button", { name: "10:30 AM" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "02:30 PM" })).toBeInTheDocument();
  });

  it("allows selecting a different day", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    const day20 = screen.getByRole("button", { name: "20" });
    await user.click(day20);

    expect(day20).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "13" })).toHaveAttribute("aria-pressed", "false");
  });

  it("allows selecting a different time slot", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    const slot = screen.getByRole("button", { name: "01:00 PM" });
    await user.click(slot);

    expect(slot).toHaveAttribute("aria-pressed", "true");
  });

  it("submits the selected date, time, name, and email to the API", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const user = userEvent.setup();
    render(<BookingForm />);

    await user.type(screen.getByLabelText("Full Name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /confirm appointment/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/schedule-consultation",
        expect.objectContaining({ method: "POST" })
      );
    });

    const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
    expect(body.name).toBe("Jane Doe");
    expect(body.email).toBe("jane@example.com");
    expect(body.time).toBe("10:30 AM");
    expect(body.date).toContain("2026-11-13");
  });

  it("shows a success state referencing the selected slot after booking", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const user = userEvent.setup();
    render(<BookingForm />);

    await user.type(screen.getByLabelText("Full Name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /confirm appointment/i }));

    expect(await screen.findByText("Appointment requested.")).toBeInTheDocument();
  });

  it("includes previously stored Discovery context in the submission", async () => {
    sessionStorage.setItem(
      "jg-funnel-intake",
      JSON.stringify({ goal: "growth", businessStage: "scaling" })
    );

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const user = userEvent.setup();
    render(<BookingForm />);

    await user.type(screen.getByLabelText("Full Name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /confirm appointment/i }));

    await waitFor(() => {
      const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.goal).toBe("growth");
      expect(body.businessStage).toBe("scaling");
    });
  });

  it("clears funnel storage after a successful booking", async () => {
    sessionStorage.setItem("jg-funnel-intake", JSON.stringify({ goal: "growth" }));

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const user = userEvent.setup();
    render(<BookingForm />);

    await user.type(screen.getByLabelText("Full Name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /confirm appointment/i }));

    await waitFor(() => {
      expect(sessionStorage.getItem("jg-funnel-intake")).toBeNull();
    });
  });

  it("shows server-provided field errors on failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: "Validation failed.",
        fieldErrors: { time: "Choose a time." },
      }),
    });

    const user = userEvent.setup();
    render(<BookingForm />);

    await user.type(screen.getByLabelText("Full Name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /confirm appointment/i }));

    expect(await screen.findByText("Choose a time.")).toBeInTheDocument();
  });
});
