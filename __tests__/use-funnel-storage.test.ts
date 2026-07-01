import { renderHook, act, waitFor } from "@testing-library/react";
import { useFunnelStorage } from "@/lib/use-funnel-storage";

describe("useFunnelStorage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("starts with empty data and becomes loaded", async () => {
    const { result } = renderHook(() => useFunnelStorage());

    await waitFor(() => expect(result.current.isLoaded).toBe(true));
    expect(result.current.data).toEqual({});
  });

  it("persists updates to sessionStorage", async () => {
    const { result } = renderHook(() => useFunnelStorage());
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.updateData({ company: "Acme Co" });
    });

    expect(result.current.data.company).toBe("Acme Co");
    expect(JSON.parse(sessionStorage.getItem("jg-funnel-intake") ?? "{}")).toEqual({
      company: "Acme Co",
    });
  });

  it("merges successive updates instead of overwriting", async () => {
    const { result } = renderHook(() => useFunnelStorage());
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.updateData({ company: "Acme Co" });
    });
    act(() => {
      result.current.updateData({ need: "New Website" });
    });

    expect(result.current.data).toEqual({
      company: "Acme Co",
      need: "New Website",
    });
  });

  it("loads previously stored data on mount", async () => {
    sessionStorage.setItem(
      "jg-funnel-intake",
      JSON.stringify({ company: "Existing Co", teamSize: "6-20" })
    );

    const { result } = renderHook(() => useFunnelStorage());

    await waitFor(() => expect(result.current.isLoaded).toBe(true));
    expect(result.current.data).toEqual({
      company: "Existing Co",
      teamSize: "6-20",
    });
  });

  it("clears stored data", async () => {
    const { result } = renderHook(() => useFunnelStorage());
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.updateData({ company: "Acme Co" });
    });
    act(() => {
      result.current.clearData();
    });

    expect(result.current.data).toEqual({});
    expect(sessionStorage.getItem("jg-funnel-intake")).toBeNull();
  });
});
