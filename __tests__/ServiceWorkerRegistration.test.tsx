import { render } from "@testing-library/react";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

describe("ServiceWorkerRegistration", () => {
  const originalEnv = process.env.NODE_ENV;
  let registerMock: jest.Mock;

  beforeEach(() => {
    registerMock = jest.fn().mockResolvedValue({});
    Object.defineProperty(navigator, "serviceWorker", {
      value: { register: registerMock },
      configurable: true,
    });
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.restoreAllMocks();
  });

  it("does not register a service worker outside production", () => {
    process.env.NODE_ENV = "test";
    render(<ServiceWorkerRegistration />);
    expect(registerMock).not.toHaveBeenCalled();
  });

  it("registers /sw.js in production", () => {
    process.env.NODE_ENV = "production";
    render(<ServiceWorkerRegistration />);
    expect(registerMock).toHaveBeenCalledWith("/sw.js");
  });

  it("renders nothing visible", () => {
    process.env.NODE_ENV = "production";
    const { container } = render(<ServiceWorkerRegistration />);
    expect(container).toBeEmptyDOMElement();
  });
});
