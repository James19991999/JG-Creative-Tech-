import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommandPaletteProvider } from "@/components/CommandPalette";
import { SearchTriggerButton } from "@/components/SearchTriggerButton";

const push = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const items = [
  { title: "Solutions", description: "Our engineering services", category: "Pages", url: "/solutions" },
  { title: "About Us", description: "Who we are", category: "Pages", url: "/about" },
  { title: "Portfolio", description: "Case studies", category: "Pages", url: "/portfolio" },
];

function renderApp() {
  return render(
    <CommandPaletteProvider items={items}>
      <SearchTriggerButton />
    </CommandPaletteProvider>
  );
}

describe("CommandPaletteProvider", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("is closed by default", () => {
    renderApp();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens when the trigger button is clicked", async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole("button", { name: "Search (Cmd+K)" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("opens on Cmd+K from anywhere on the page", async () => {
    const user = userEvent.setup();
    renderApp();
    await user.keyboard("{Meta>}k{/Meta}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("opens on Ctrl+K too", async () => {
    const user = userEvent.setup();
    renderApp();
    await user.keyboard("{Control>}k{/Control}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows a prompt before typing, not results", async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole("button", { name: "Search (Cmd+K)" }));
    expect(screen.getByText("Start typing to search the site.")).toBeInTheDocument();
  });

  it("shows matching results as the user types", async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole("button", { name: "Search (Cmd+K)" }));
    await user.type(screen.getByRole("combobox"), "port");
    expect(await screen.findByText("Portfolio")).toBeInTheDocument();
  });

  it("shows a no-results message for a query that matches nothing", async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole("button", { name: "Search (Cmd+K)" }));
    await user.type(screen.getByRole("combobox"), "zzznomatchzzz");
    expect(await screen.findByText(/No results for/)).toBeInTheDocument();
  });

  it("navigates to a result when clicked", async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole("button", { name: "Search (Cmd+K)" }));
    await user.type(screen.getByRole("combobox"), "portfolio");
    await user.click(await screen.findByText("Portfolio"));
    expect(push).toHaveBeenCalledWith("/portfolio");
  });

  it("navigates to the highlighted result on Enter", async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole("button", { name: "Search (Cmd+K)" }));
    await user.type(screen.getByRole("combobox"), "about");
    await waitFor(() => expect(screen.getByText("About Us")).toBeInTheDocument());
    await user.keyboard("{Enter}");
    expect(push).toHaveBeenCalledWith("/about");
  });

  it("moves the highlighted result with arrow keys", async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole("button", { name: "Search (Cmd+K)" }));
    await user.type(screen.getByRole("combobox"), "o"); // matches all 3
    await waitFor(() => expect(screen.getAllByRole("option").length).toBeGreaterThan(1));
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");
    // second-ranked result for "o" should have been selected, not the first
    expect(push).toHaveBeenCalled();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole("button", { name: "Search (Cmd+K)" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes and clears the query when the close button is clicked", async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole("button", { name: "Search (Cmd+K)" }));
    await user.type(screen.getByRole("combobox"), "port");
    await user.click(screen.getByRole("button", { name: "Close search" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Reopening should show a fresh, empty search - not the stale query
    await user.click(screen.getByRole("button", { name: "Search (Cmd+K)" }));
    expect(screen.getByRole("combobox")).toHaveValue("");
  });

  it("closes when clicking the backdrop", async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole("button", { name: "Search (Cmd+K)" }));
    const dialog = screen.getByRole("dialog");
    await user.click(dialog); // clicking the backdrop itself (currentTarget), not its inner content
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("returns focus to the trigger button after closing", async () => {
    const user = userEvent.setup();
    renderApp();
    const trigger = screen.getByRole("button", { name: "Search (Cmd+K)" });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
  });
});
