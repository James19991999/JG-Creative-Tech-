import { renderWithIntl, screen, fireEvent, waitFor } from "@/test-support/test-utils";
import { ChatWidget } from "@/components/ChatWidget";
import { usePathname } from "@/i18n/navigation";

jest.mock("@/i18n/navigation", () => ({
  usePathname: jest.fn(),
}));

const mockedUsePathname = usePathname as jest.Mock;

beforeEach(() => {
  mockedUsePathname.mockReturnValue("/");
  global.fetch = jest.fn();
  Element.prototype.scrollIntoView = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("ChatWidget", () => {
  it("renders the launcher closed by default", () => {
    renderWithIntl(<ChatWidget />);
    expect(screen.getByRole("button", { name: "Open chat assistant" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("is hidden on the discovery funnel step", () => {
    mockedUsePathname.mockReturnValue("/get-started/discovery");
    renderWithIntl(<ChatWidget />);
    expect(screen.queryByRole("button", { name: "Open chat assistant" })).not.toBeInTheDocument();
  });

  it("is hidden on the schedule-consultation funnel step", () => {
    mockedUsePathname.mockReturnValue("/schedule-consultation");
    renderWithIntl(<ChatWidget />);
    expect(screen.queryByRole("button", { name: "Open chat assistant" })).not.toBeInTheDocument();
  });

  it("opens the panel and shows the greeting when the launcher is clicked", () => {
    renderWithIntl(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Open chat assistant" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/I can answer questions about our services/)).toBeInTheDocument();
  });

  it("closes the panel when the launcher is clicked again", () => {
    renderWithIntl(<ChatWidget />);
    const launcher = screen.getByRole("button", { name: "Open chat assistant" });
    fireEvent.click(launcher);
    fireEvent.click(screen.getByRole("button", { name: "Close chat" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the panel on Escape", () => {
    renderWithIntl(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Open chat assistant" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("sends a message and displays the reply", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "We build websites for Kenyan SMEs." }),
    });

    renderWithIntl(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Open chat assistant" }));

    const input = screen.getByPlaceholderText("Type a message…");
    fireEvent.change(input, { target: { value: "What do you do?" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(screen.getByText("What do you do?")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("We build websites for Kenyan SMEs.")).toBeInTheDocument();
    });

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(JSON.parse(options.body).messages).toEqual([
      { role: "user", content: "What do you do?" },
    ]);
  });

  it("sends a message when Enter is pressed, not just via the send button", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "Sure!" }),
    });

    renderWithIntl(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Open chat assistant" }));

    const input = screen.getByPlaceholderText("Type a message…");
    fireEvent.change(input, { target: { value: "Hi" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("does not send an empty or whitespace-only message", () => {
    renderWithIntl(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Open chat assistant" }));
    const sendButton = screen.getByRole("button", { name: "Send" });
    expect(sendButton).toBeDisabled();
  });

  it("shows a specific message for a rate-limit (429) response", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({ error: "generic error" }),
    });

    renderWithIntl(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Open chat assistant" }));
    fireEvent.change(screen.getByPlaceholderText("Type a message…"), {
      target: { value: "hi" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(screen.getByText(/sending messages too quickly/i)).toBeInTheDocument();
    });
  });

  it("shows a generic error when the request fails entirely", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("network down"));

    renderWithIntl(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Open chat assistant" }));
    fireEvent.change(screen.getByPlaceholderText("Type a message…"), {
      target: { value: "hi" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(screen.getByText(/Couldn.t get a response/i)).toBeInTheDocument();
    });
  });

  it("clears the conversation via the new-conversation control", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "Answer." }),
    });

    renderWithIntl(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Open chat assistant" }));
    fireEvent.change(screen.getByPlaceholderText("Type a message…"), {
      target: { value: "hi" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    await waitFor(() => expect(screen.getByText("Answer.")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "Start a new conversation" }));
    expect(screen.queryByText("Answer.")).not.toBeInTheDocument();
    expect(screen.queryByText("hi")).not.toBeInTheDocument();
  });
});
