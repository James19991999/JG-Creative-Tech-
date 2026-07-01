import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewsletterSignup } from "@/components/NewsletterSignup";

describe("NewsletterSignup", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders an email input and subscribe button", () => {
    render(<NewsletterSignup />);
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeInTheDocument();
  });

  it("submits the email to /api/newsletter", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const user = userEvent.setup();
    render(<NewsletterSignup />);

    await user.type(screen.getByLabelText("Email address"), "james@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/newsletter",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ email: "james@example.com" }),
        })
      );
    });
  });

  it("shows a success message after subscribing", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const user = userEvent.setup();
    render(<NewsletterSignup />);

    await user.type(screen.getByLabelText("Email address"), "james@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));

    expect(await screen.findByText(/You're subscribed/)).toBeInTheDocument();
  });

  it("shows a server error message on failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Enter a valid email address." }),
    });

    const user = userEvent.setup();
    render(<NewsletterSignup />);

    await user.type(screen.getByLabelText("Email address"), "bad");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));

    expect(await screen.findByText("Enter a valid email address.")).toBeInTheDocument();
  });
});
