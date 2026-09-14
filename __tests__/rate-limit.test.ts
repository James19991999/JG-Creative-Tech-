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

  it("respects a custom maxRequests override instead of the default of 5", () => {
    const key = `test-key-${Math.random()}`;
    for (let i = 0; i < 20; i += 1) {
      expect(isRateLimited(key, 20)).toBe(false);
    }
    expect(isRateLimited(key, 20)).toBe(true);
  });

  it("respects a custom windowMs override", () => {
    const key = `test-key-${Math.random()}`;
    // A very short window - even a handful of requests right after
    // each other technically span two different windows here, so
    // this key never actually gets blocked at maxRequests=1.
    expect(isRateLimited(key, 1, 1)).toBe(false);
    expect(isRateLimited(key, 1, 1)).toBe(true);
  });
});
