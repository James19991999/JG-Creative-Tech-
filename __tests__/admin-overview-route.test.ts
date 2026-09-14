/**
 * @jest-environment node
 */
import { GET } from "@/app/api/admin/overview/route";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { verifyAdminRequest } from "@/lib/admin-auth";

jest.mock("@/lib/firebase-admin", () => ({
  getAdminAuth: jest.fn(),
  getAdminDb: jest.fn(),
}));
jest.mock("@/lib/admin-auth", () => ({
  verifyAdminRequest: jest.fn(),
}));

const mockedGetAdminAuth = getAdminAuth as jest.Mock;
const mockedGetAdminDb = getAdminDb as jest.Mock;
const mockedVerifyAdmin = verifyAdminRequest as jest.Mock;

function makeRequest() {
  return new Request("https://example.com/api/admin/overview", {
    headers: { Authorization: "Bearer token" },
  });
}

function clientDoc(uid: string, data: Record<string, unknown>) {
  return { id: uid, data: () => data };
}

function invoiceDoc(uid: string, id: string, data: Record<string, unknown>) {
  return { id, ref: { parent: { parent: { id: uid } } }, data: () => data };
}

function messageDoc(uid: string, data: Record<string, unknown>) {
  return { ref: { parent: { parent: { id: uid } } }, data: () => data };
}

describe("GET /api/admin/overview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetAdminAuth.mockReturnValue({
      getUser: jest.fn().mockResolvedValue({ email: "client@example.com" }),
    });
  });

  it("returns 503 when Firebase isn't configured", async () => {
    mockedGetAdminDb.mockReturnValue(null);
    const res = await GET(makeRequest());
    expect(res.status).toBe(503);
  });

  it("returns 403 when the caller isn't a verified admin", async () => {
    mockedGetAdminDb.mockReturnValue({});
    mockedVerifyAdmin.mockResolvedValue(null);
    const res = await GET(makeRequest());
    expect(res.status).toBe(403);
  });

  it("sorts invoices with overdue first, then sent, then paid, then draft", async () => {
    mockedVerifyAdmin.mockResolvedValue("admin-uid");
    mockedGetAdminDb.mockReturnValue({
      collection: () => ({
        get: async () => ({ docs: [clientDoc("uid1", { displayName: "Jane" })] }),
      }),
      collectionGroup: (name: string) => {
        if (name === "invoices") {
          return {
            get: async () => ({
              docs: [
                invoiceDoc("uid1", "i1", { number: "001", status: "draft", amountCents: 100, currency: "USD", dueAt: "2026-01-01" }),
                invoiceDoc("uid1", "i2", { number: "002", status: "overdue", amountCents: 200, currency: "USD", dueAt: "2026-01-01" }),
                invoiceDoc("uid1", "i3", { number: "003", status: "sent", amountCents: 300, currency: "USD", dueAt: "2026-01-01" }),
              ],
            }),
          };
        }
        return { orderBy: () => ({ get: async () => ({ docs: [] }) }) };
      },
    });

    const res = await GET(makeRequest());
    const json = await res.json();

    expect(json.invoices.map((i: any) => i.status)).toEqual(["overdue", "sent", "draft"]);
  });

  it("marks a message thread as needing reply only when the client spoke last", async () => {
    mockedVerifyAdmin.mockResolvedValue("admin-uid");
    mockedGetAdminDb.mockReturnValue({
      collection: () => ({
        get: async () => ({
          docs: [clientDoc("uid1", {}), clientDoc("uid2", {})],
        }),
      }),
      collectionGroup: (name: string) => {
        if (name === "messages") {
          return {
            orderBy: () => ({
              get: async () => ({
                // newest-first, as the real query orders them
                docs: [
                  messageDoc("uid1", { body: "hello?", sentBy: "client", createdAt: "2026-01-02" }),
                  messageDoc("uid1", { body: "hi there", sentBy: "team", createdAt: "2026-01-01" }),
                  messageDoc("uid2", { body: "thanks!", sentBy: "team", createdAt: "2026-01-02" }),
                ],
              }),
            }),
          };
        }
        return { get: async () => ({ docs: [] }) };
      },
    });

    const res = await GET(makeRequest());
    const json = await res.json();

    const uid1Thread = json.messageThreads.find((t: any) => t.uid === "uid1");
    const uid2Thread = json.messageThreads.find((t: any) => t.uid === "uid2");
    expect(uid1Thread.needsReply).toBe(true);
    expect(uid1Thread.lastMessage.body).toBe("hello?"); // the newest one, not the oldest
    expect(uid2Thread.needsReply).toBe(false);
  });
});
