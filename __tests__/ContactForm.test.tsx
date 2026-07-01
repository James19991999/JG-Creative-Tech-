import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/ContactForm";

describe("ContactForm", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders all required fields", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Business Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Project Details")).toBeInTheDocument();
  });

  it("submits the form data to /api/contact", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Jane Doe");
    await user.type(screen.getByLabelText("Business Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Project Details"), "Need a new site");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/contact",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("shows a success state after a successful submission", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Jane Doe");
    await user.type(screen.getByLabelText("Business Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Project Details"), "Need a new site");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText("Message sent.")).toBeInTheDocument();
  });

  it("shows a server-provided error message on failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Too many requests. Please try again in a minute." }),
    });

    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Jane Doe");
    await user.type(screen.getByLabelText("Business Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Project Details"), "Need a new site");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText("Too many requests. Please try again in a minute.")
    ).toBeInTheDocument();
  });

  it("shows a network error message when fetch rejects", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network down"));

    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Jane Doe");
    await user.type(screen.getByLabelText("Business Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Project Details"), "Need a new site");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText(/network error/i)
    ).toBeInTheDocument();
  });
});
