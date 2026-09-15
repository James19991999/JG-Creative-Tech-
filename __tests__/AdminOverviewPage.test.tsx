import { render, screen, waitFor } from "@testing-library/react";
import AdminOverviewPage from "@/app/client-portal/admin/page";
import { useClientPortalAuth } from "@/components/client-portal/AuthProvider";

const replace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

jest.mock("@/components/client-portal/AuthProvider", () => ({
  useClientPortalAuth: jest.fn(),
}));

const mockedUseAuth = useClientPortalAuth as jest.Mock;

function makeUser(isAdmin: boolean) {
  return {
    uid: "admin-uid",
    getIdTokenResult: jest.fn().mockResolvedValue({
      claims: { admin: isAdmin },
      token: "fake-token",
    }),
  };
}

beforeEach(() => {
  replace.mockClear();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("AdminOverviewPage", () => {
  it("shows access denied for a signed-in non-admin account", async () => {
    mockedUseAuth.mockReturnValue({ user: makeUser(false), loading: false, configured: true });
    render(<AdminOverviewPage />);
    expect(await screen.findByText("Access denied")).toBeInTheDocument();
  });

  it("visibly flags a client whose profile has no project yet but is pending review - the real bug found in this exact rendering logic", async () => {
    mockedUseAuth.mockReturnValue({ user: makeUser(true), loading: false, configured: true });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        clients: [
          {
            uid: "uid1",
            email: "newclient@example.com",
            displayName: "Jane Doe",
            company: "",
            activeProjectName: "", // empty, exactly like a real new sign-up
            activeProjectStatus: "New sign-up - pending review",
          },
        ],
        invoices: [],
        messageThreads: [],
      }),
    });

    render(<AdminOverviewPage />);

    // The whole point of this test: an empty activeProjectName must
    // never cause the pending-review flag to silently not render.
    expect(await screen.findByText("New sign-up - needs review")).toBeInTheDocument();
  });

  it("still shows a normal client's project name and status when both are present", async () => {
    mockedUseAuth.mockReturnValue({ user: makeUser(true), loading: false, configured: true });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        clients: [
          {
            uid: "uid2",
            email: "regular@example.com",
            displayName: "Sam Otieno",
            company: "Acme Co",
            activeProjectName: "Website Redesign",
            activeProjectStatus: "In progress",
          },
        ],
        invoices: [],
        messageThreads: [],
      }),
    });

    render(<AdminOverviewPage />);

    expect(await screen.findByText("Website Redesign - In progress")).toBeInTheDocument();
    expect(screen.queryByText("New sign-up - needs review")).not.toBeInTheDocument();
  });

  it("counts pending-review sign-ups in the section heading", async () => {
    mockedUseAuth.mockReturnValue({ user: makeUser(true), loading: false, configured: true });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        clients: [
          {
            uid: "uid1",
            email: "a@example.com",
            displayName: "",
            company: "",
            activeProjectName: "",
            activeProjectStatus: "New sign-up - pending review",
          },
          {
            uid: "uid2",
            email: "b@example.com",
            displayName: "",
            company: "",
            activeProjectName: "Real Project",
            activeProjectStatus: "In progress",
          },
        ],
        invoices: [],
        messageThreads: [],
      }),
    });

    render(<AdminOverviewPage />);

    await waitFor(() => {
      expect(screen.getByText(/Clients \(2, 1 new sign-up needs review\)/)).toBeInTheDocument();
    });
  });
});
