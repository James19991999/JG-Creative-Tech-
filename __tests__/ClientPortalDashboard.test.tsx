import { render, screen } from "@testing-library/react";
import { ClientPortalDashboard } from "@/components/client-portal/Dashboard";
import { useClientPortalAuth } from "@/components/client-portal/AuthProvider";
import {
  useClientDocuments,
  useClientInvoices,
  useClientNotifications,
  useClientProfile,
} from "@/lib/client-portal/hooks";

const replace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

jest.mock("@/components/client-portal/AuthProvider", () => ({
  useClientPortalAuth: jest.fn(),
}));

jest.mock("@/lib/client-portal/hooks", () => ({
  useClientDocuments: jest.fn(),
  useClientInvoices: jest.fn(),
  useClientNotifications: jest.fn(),
  useClientProfile: jest.fn(),
}));

const mockedUseAuth = useClientPortalAuth as jest.Mock;
const mockedDocs = useClientDocuments as jest.Mock;
const mockedInvoices = useClientInvoices as jest.Mock;
const mockedNotifications = useClientNotifications as jest.Mock;
const mockedProfile = useClientProfile as jest.Mock;

const baseUser = {
  uid: "test-uid",
  email: "client@example.com",
  metadata: { lastSignInTime: undefined },
};

function setupDefaultMocks() {
  mockedDocs.mockReturnValue({ data: [], loading: false, error: null });
  mockedInvoices.mockReturnValue({ data: [], loading: false, error: null });
  mockedNotifications.mockReturnValue({ data: [], loading: false, error: null });
  mockedProfile.mockReturnValue({ profile: null, loading: false, error: null });
}

describe("ClientPortalDashboard", () => {
  beforeEach(() => {
    replace.mockClear();
    setupDefaultMocks();
  });

  it("shows a configuration message when Firebase isn't set up", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: false,
      configured: false,
      signOut: jest.fn(),
    });
    render(<ClientPortalDashboard />);
    expect(screen.getByText(/isn.t configured yet/i)).toBeInTheDocument();
  });

  it("shows a loading state while auth is resolving", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: true,
      configured: true,
      signOut: jest.fn(),
    });
    render(<ClientPortalDashboard />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("redirects to sign-in when not authenticated", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: false,
      configured: true,
      signOut: jest.fn(),
    });
    render(<ClientPortalDashboard />);
    expect(replace).toHaveBeenCalledWith("/client-portal/sign-in");
  });

  it("greets the signed-in client by their profile display name", () => {
    mockedUseAuth.mockReturnValue({
      user: baseUser,
      loading: false,
      configured: true,
      signOut: jest.fn(),
    });
    mockedProfile.mockReturnValue({
      profile: {
        displayName: "Sarah Kimani",
        activeProjectName: "",
        activeProjectDescription: "",
        cdnUptimePercent: 0,
      },
      loading: false,
      error: null,
    });
    render(<ClientPortalDashboard />);
    expect(screen.getByText(/Welcome back, Sarah Kimani/)).toBeInTheDocument();
  });

  it("falls back to the account email when no profile display name is set", () => {
    mockedUseAuth.mockReturnValue({
      user: baseUser,
      loading: false,
      configured: true,
      signOut: jest.fn(),
    });
    render(<ClientPortalDashboard />);
    expect(
      screen.getByText(/Welcome back, client@example.com/)
    ).toBeInTheDocument();
  });

  it("shows an empty state when there are no documents", () => {
    mockedUseAuth.mockReturnValue({
      user: baseUser,
      loading: false,
      configured: true,
      signOut: jest.fn(),
    });
    render(<ClientPortalDashboard />);
    expect(
      screen.getByText(/No documents yet\. Use "Upload Documents" to add one\./)
    ).toBeInTheDocument();
  });

  it("lists real documents with a working download control", () => {
    mockedUseAuth.mockReturnValue({
      user: baseUser,
      loading: false,
      configured: true,
      signOut: jest.fn(),
    });
    mockedDocs.mockReturnValue({
      data: [
        {
          id: "doc1",
          name: "Strategic-Roadmap.pdf",
          storagePath: "clients/test-uid/documents/1-Strategic-Roadmap.pdf",
          contentType: "application/pdf",
          sizeBytes: 204800,
          uploadedAt: "2026-08-01T00:00:00.000Z",
          uploadedBy: "client",
          visibility: "shared",
        },
      ],
      loading: false,
      error: null,
    });
    render(<ClientPortalDashboard />);
    expect(screen.getByText("Strategic-Roadmap.pdf")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Download Strategic-Roadmap.pdf" })
    ).toBeInTheDocument();
  });

  it("shows no active-project fallback copy when the client has no assigned project", () => {
    mockedUseAuth.mockReturnValue({
      user: baseUser,
      loading: false,
      configured: true,
      signOut: jest.fn(),
    });
    render(<ClientPortalDashboard />);
    expect(
      screen.getByText(/No active project has been assigned to your account yet\./)
    ).toBeInTheDocument();
  });

  it("renders real invoice data instead of placeholder content", () => {
    mockedUseAuth.mockReturnValue({
      user: baseUser,
      loading: false,
      configured: true,
      signOut: jest.fn(),
    });
    mockedInvoices.mockReturnValue({
      data: [
        {
          id: "inv1",
          number: "INV-2026-014",
          amountCents: 450000,
          currency: "USD",
          status: "sent",
          issuedAt: "2026-08-01T00:00:00.000Z",
          dueAt: "2026-08-15T00:00:00.000Z",
        },
      ],
      loading: false,
      error: null,
    });
    render(<ClientPortalDashboard />);
    expect(screen.getByText("Invoice INV-2026-014")).toBeInTheDocument();
    expect(screen.getByText("$4,500.00")).toBeInTheDocument();
  });
});
