import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignUpForm } from "@/components/client-portal/SignUpForm";
import { useClientPortalAuth } from "@/components/client-portal/AuthProvider";

jest.mock("@/components/client-portal/AuthProvider", () => ({
  useClientPortalAuth: jest.fn(),
}));

const mockedPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockedPush }),
}));

const mockedUseAuth = useClientPortalAuth as jest.Mock;

describe("SignUpForm", () => {
  beforeEach(() => {
    mockedPush.mockClear();
  });

  it("shows a clear message instead of a form when the portal isn't configured", () => {
    mockedUseAuth.mockReturnValue({ signUp: jest.fn(), configured: false });
    render(<SignUpForm />);
    expect(screen.getByText(/isn.t configured yet/i)).toBeInTheDocument();
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
  });

  it("renders name, email, password, and confirm password fields when configured", () => {
    mockedUseAuth.mockReturnValue({ signUp: jest.fn(), configured: true });
    render(<SignUpForm />);
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
  });

  it("calls signUp with the entered details and redirects on success", async () => {
    const signUp = jest.fn().mockResolvedValue(undefined);
    mockedUseAuth.mockReturnValue({ signUp, configured: true });
    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(screen.getByLabelText("Full name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Password"), "a-strong-password");
    await user.type(screen.getByLabelText("Confirm password"), "a-strong-password");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(signUp).toHaveBeenCalledWith("jane@example.com", "a-strong-password", "Jane Doe");
    expect(mockedPush).toHaveBeenCalledWith("/client-portal");
  });

  it("shows an error and never calls signUp when the passwords don't match", async () => {
    const signUp = jest.fn();
    mockedUseAuth.mockReturnValue({ signUp, configured: true });
    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(screen.getByLabelText("Full name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Password"), "a-strong-password");
    await user.type(screen.getByLabelText("Confirm password"), "a-different-password");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(screen.getByText(/don't match/i)).toBeInTheDocument();
    expect(signUp).not.toHaveBeenCalled();
    expect(mockedPush).not.toHaveBeenCalled();
  });

  it("surfaces the server's own error message (e.g. duplicate email) rather than a generic one", async () => {
    const signUp = jest
      .fn()
      .mockRejectedValue(new Error("An account with that email already exists. Try signing in instead."));
    mockedUseAuth.mockReturnValue({ signUp, configured: true });
    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(screen.getByLabelText("Full name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Password"), "a-strong-password");
    await user.type(screen.getByLabelText("Confirm password"), "a-strong-password");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(
      await screen.findByText(/account with that email already exists/i)
    ).toBeInTheDocument();
    expect(mockedPush).not.toHaveBeenCalled();
  });

  it("falls back to a generic error message for an unrecognized failure", async () => {
    const signUp = jest.fn().mockRejectedValue({ code: "auth/network-request-failed" });
    mockedUseAuth.mockReturnValue({ signUp, configured: true });
    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(screen.getByLabelText("Full name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Password"), "a-strong-password");
    await user.type(screen.getByLabelText("Confirm password"), "a-strong-password");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(
      await screen.findByText(/couldn.t create your account/i)
    ).toBeInTheDocument();
  });
});
