import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrivacyContactForm } from "@/components/PrivacyContactForm";

describe("PrivacyContactForm", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders name, email, and message fields", () => {
    render(<PrivacyContactForm />);

    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
  });

  it("submits to /api/contact tagged as a privacy inquiry", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const user = userEvent.setup();
    render(<PrivacyContactForm />);

    await user.type(screen.getByLabelText("Full Name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email Address"), "jane@example.com");
    await user.type(screen.getByLabelText("Message"), "What data do you hold on me?");
    await user.click(screen.getByRole("button", { name: /submit inquiry/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/contact",
        expect.objectContaining({ method: "POST" })
      );
    });

    const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
    expect(body.name).toBe("Jane Doe");
    expect(body.details).toContain("[Privacy/DPO Inquiry]");
    expect(body.details).toContain("What data do you hold on me?");
  });

  it("shows a success message referencing the DPO after submission", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const user = userEvent.setup();
    render(<PrivacyContactForm />);

    await user.type(screen.getByLabelText("Full Name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email Address"), "jane@example.com");
    await user.type(screen.getByLabelText("Message"), "Question");
    await user.click(screen.getByRole("button", { name: /submit inquiry/i }));

    expect(await screen.findByText("Inquiry sent.")).toBeInTheDocument();
  });

  it("shows an error message on failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Too many requests." }),
    });

    const user = userEvent.setup();
    render(<PrivacyContactForm />);

    await user.type(screen.getByLabelText("Full Name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email Address"), "jane@example.com");
    await user.type(screen.getByLabelText("Message"), "Question");
    await user.click(screen.getByRole("button", { name: /submit inquiry/i }));

    expect(await screen.findByText("Too many requests.")).toBeInTheDocument();
  });
});
