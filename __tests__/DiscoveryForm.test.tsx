import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { DiscoveryForm } from "@/components/DiscoveryForm";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("DiscoveryForm", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    sessionStorage.clear();
    pushMock.mockClear();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it("renders the form fields once loaded", async () => {
    render(<DiscoveryForm />);

    expect(await screen.findByText("Web Development")).toBeInTheDocument();
    expect(screen.getByText("Digital Transformation")).toBeInTheDocument();
    expect(screen.getByText("Growth & Strategy")).toBeInTheDocument();
    expect(screen.getByLabelText("Current Business Stage")).toBeInTheDocument();
    expect(screen.getByLabelText("Tell us more")).toBeInTheDocument();
  });

  it("defaults to 'Growth & Strategy' per the source design", async () => {
    render(<DiscoveryForm />);

    await screen.findByText("Growth & Strategy");
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    const growthRadio = radios.find((r) => r.value === "growth");
    expect(growthRadio).toBeChecked();
  });

  it("saves entered data to sessionStorage and navigates to schedule-consultation on submit", async () => {
    const user = userEvent.setup();
    render(<DiscoveryForm />);

    await screen.findByText("Web Development");
    await user.click(screen.getByText("Web Development"));
    await user.selectOptions(
      screen.getByLabelText("Current Business Stage"),
      "scaling"
    );
    await user.type(
      screen.getByLabelText("Tell us more"),
      "Need to modernize our stack"
    );
    await user.click(screen.getByRole("button", { name: /next step/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/schedule-consultation");
    });

    const stored = JSON.parse(sessionStorage.getItem("jg-funnel-intake") ?? "{}");
    expect(stored.goal).toBe("web-dev");
    expect(stored.businessStage).toBe("scaling");
    expect(stored.moreInfo).toBe("Need to modernize our stack");
  });

  it("pre-fills fields from previously stored funnel data", async () => {
    sessionStorage.setItem(
      "jg-funnel-intake",
      JSON.stringify({
        goal: "digital-transformation",
        businessStage: "enterprise",
        moreInfo: "Legacy system overhaul",
      })
    );

    render(<DiscoveryForm />);

    await screen.findByText("Digital Transformation");
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    const transformationRadio = radios.find((r) => r.value === "digital-transformation");
    expect(transformationRadio).toBeChecked();
    expect(screen.getByLabelText("Tell us more")).toHaveValue("Legacy system overhaul");
  });

  it("provides a Save and Exit link back to home", async () => {
    render(<DiscoveryForm />);

    const exitLink = await screen.findByRole("link", { name: /save and exit/i });
    expect(exitLink).toHaveAttribute("href", "/");
  });
});
