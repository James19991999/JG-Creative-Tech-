import { isRateLimited } from "@/lib/rate-limit";

describe("isRateLimited", () => {
  it("allows the first request for a fresh key", () => {
    const key = `test-key-${Math.random()}`;
    expect(isRateLimited(key)).toBe(false);
  });

  it("allows up to the configured limit within the window", () => {
    const key = `test-key-${Math.random()}`;
    // First request already consumed one slot via window initialization.
    expect(isRateLimited(key)).toBe(false);
    expect(isRateLimited(key)).toBe(false);
    expect(isRateLimited(key)).toBe(false);
    expect(isRateLimited(key)).toBe(false);
    expect(isRateLimited(key)).toBe(false);
  });

  it("blocks requests once the limit is exceeded within the window", () => {
    const key = `test-key-${Math.random()}`;
    for (let i = 0; i < 5; i += 1) {
      isRateLimited(key);
    }
    expect(isRateLimited(key)).toBe(true);
  });

  it("tracks separate keys independently", () => {
    const keyA = `test-key-a-${Math.random()}`;
    const keyB = `test-key-b-${Math.random()}`;

    for (let i = 0; i < 5; i += 1) {
      isRateLimited(keyA);
    }

    expect(isRateLimited(keyA)).toBe(true);
    expect(isRateLimited(keyB)).toBe(false);
  });
});
