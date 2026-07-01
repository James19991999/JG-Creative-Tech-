import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrategicContextForm } from "@/components/StrategicContextForm";

describe("StrategicContextForm", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders all four KPI options", () => {
    render(<StrategicContextForm />);

    expect(screen.getByText("User Growth")).toBeInTheDocument();
    expect(screen.getByText("Operational Efficiency")).toBeInTheDocument();
    expect(screen.getByText("Revenue Generation")).toBeInTheDocument();
    expect(screen.getByText("Brand Authority")).toBeInTheDocument();
  });

  it("defaults to Operational Efficiency per the source design", () => {
    render(<StrategicContextForm />);

    const button = screen.getByRole("button", { name: /operational efficiency/i });
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("allows selecting a different KPI", async () => {
    const user = userEvent.setup();
    render(<StrategicContextForm />);

    const revenueButton = screen.getByRole("button", { name: /revenue generation/i });
    await user.click(revenueButton);

    expect(revenueButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /operational efficiency/i })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("defaults Scalability and Speed priorities to checked", () => {
    render(<StrategicContextForm />);

    expect(screen.getByRole("checkbox", { name: "Scalability" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Speed" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Security" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Maintenance" })).not.toBeChecked();
  });

  it("toggles a priority checkbox", async () => {
    const user = userEvent.setup();
    render(<StrategicContextForm />);

    const securityCheckbox = screen.getByRole("checkbox", { name: "Security" });
    await user.click(securityCheckbox);

    expect(securityCheckbox).toBeChecked();
  });

  it("submits the form to /api/contact with strategic context details", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const user = userEvent.setup();
    render(<StrategicContextForm />);

    await user.type(
      screen.getByLabelText("Current Infrastructure Description"),
      "Legacy PHP monolith"
    );
    await user.type(screen.getByLabelText("Your Email"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /finalize strategy/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/contact",
        expect.objectContaining({ method: "POST" })
      );
    });

    const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
    expect(body.email).toBe("jane@example.com");
    expect(body.details).toContain("Operational Efficiency");
    expect(body.details).toContain("Legacy PHP monolith");
  });

  it("shows a success message after submission", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const user = userEvent.setup();
    render(<StrategicContextForm />);

    await user.type(screen.getByLabelText("Your Email"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /finalize strategy/i }));

    expect(await screen.findByText("Strategy finalized.")).toBeInTheDocument();
  });
});
