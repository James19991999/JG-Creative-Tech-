import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignInForm } from "@/components/client-portal/SignInForm";
import { useClientPortalAuth } from "@/components/client-portal/AuthProvider";

jest.mock("@/components/client-portal/AuthProvider", () => ({
  useClientPortalAuth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockedUseAuth = useClientPortalAuth as jest.Mock;

describe("SignInForm", () => {
  it("shows a clear message instead of a form when the portal isn't configured", () => {
    mockedUseAuth.mockReturnValue({
      signIn: jest.fn(),
      configured: false,
    });
    render(<SignInForm />);
    expect(
      screen.getByText(/isn.t configured yet/i)
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
  });

  it("renders email and password fields when configured", () => {
    mockedUseAuth.mockReturnValue({
      signIn: jest.fn(),
      configured: true,
    });
    render(<SignInForm />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("calls signIn with the entered credentials on submit", async () => {
    const signIn = jest.fn().mockResolvedValue(undefined);
    mockedUseAuth.mockReturnValue({ signIn, configured: true });
    const user = userEvent.setup();

    render(<SignInForm />);
    await user.type(screen.getByLabelText("Email"), "client@example.com");
    await user.type(screen.getByLabelText("Password"), "correct-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(signIn).toHaveBeenCalledWith("client@example.com", "correct-password");
  });

  it("shows a friendly error message when sign-in fails with a known Firebase error code", async () => {
    const signIn = jest.fn().mockRejectedValue({ code: "auth/invalid-credential" });
    mockedUseAuth.mockReturnValue({ signIn, configured: true });
    const user = userEvent.setup();

    render(<SignInForm />);
    await user.type(screen.getByLabelText("Email"), "client@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "That email or password isn't right."
    );
  });

  it("falls back to a generic error message for unrecognized failures", async () => {
    const signIn = jest.fn().mockRejectedValue(new Error("network down"));
    mockedUseAuth.mockReturnValue({ signIn, configured: true });
    const user = userEvent.setup();

    render(<SignInForm />);
    await user.type(screen.getByLabelText("Email"), "client@example.com");
    await user.type(screen.getByLabelText("Password"), "whatever");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Sign-in failed. Please try again."
    );
  });
});
