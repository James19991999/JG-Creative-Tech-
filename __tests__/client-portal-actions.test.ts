import {
  ClientPortalActionError,
  sendClientMessage,
  startInvoicePayment,
  uploadClientDocument,
} from "@/lib/client-portal/actions";
import { getFirebaseDb, getFirebaseStorage } from "@/lib/firebase-client";
import { addDoc, collection } from "firebase/firestore";
import { uploadBytes } from "firebase/storage";

jest.mock("@/lib/firebase-client", () => ({
  getFirebaseDb: jest.fn(),
  getFirebaseStorage: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock("firebase/storage", () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

const mockedGetDb = getFirebaseDb as jest.Mock;
const mockedGetStorage = getFirebaseStorage as jest.Mock;
const mockedAddDoc = addDoc as jest.Mock;
const mockedUploadBytes = uploadBytes as jest.Mock;

describe("sendClientMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetDb.mockReturnValue({});
  });

  it("rejects an empty message before touching Firestore", async () => {
    await expect(sendClientMessage("uid1", "   ")).rejects.toThrow(
      ClientPortalActionError
    );
    expect(mockedAddDoc).not.toHaveBeenCalled();
  });

  it("rejects a message over the 2000-character limit", async () => {
    await expect(
      sendClientMessage("uid1", "a".repeat(2001))
    ).rejects.toThrow("too long");
    expect(mockedAddDoc).not.toHaveBeenCalled();
  });

  it("throws a clear error when the portal isn't configured", async () => {
    mockedGetDb.mockReturnValue(null);
    await expect(sendClientMessage("uid1", "hello")).rejects.toThrow(
      "Portal is not configured."
    );
  });

  it("writes a trimmed message tagged as sent by the client", async () => {
    mockedAddDoc.mockResolvedValue(undefined);
    await sendClientMessage("uid1", "  Can we move the call?  ");
    expect(mockedAddDoc).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({
        body: "Can we move the call?",
        sentBy: "client",
      })
    );
  });
});

describe("uploadClientDocument", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetDb.mockReturnValue({});
    mockedGetStorage.mockReturnValue({});
  });

  it("rejects files over the 20MB limit before calling Storage", async () => {
    const bigFile = {
      size: 21 * 1024 * 1024,
      name: "huge.zip",
      type: "application/zip",
    } as File;

    await expect(uploadClientDocument("uid1", bigFile)).rejects.toThrow(
      "20MB upload limit"
    );
    expect(mockedUploadBytes).not.toHaveBeenCalled();
  });

  it("throws a clear error when the portal isn't configured", async () => {
    mockedGetStorage.mockReturnValue(null);
    const file = { size: 100, name: "doc.pdf", type: "application/pdf" } as File;
    await expect(uploadClientDocument("uid1", file)).rejects.toThrow(
      "Portal is not configured."
    );
  });

  it("uploads within the limit and records a Firestore document", async () => {
    mockedUploadBytes.mockResolvedValue(undefined);
    mockedAddDoc.mockResolvedValue(undefined);
    const file = { size: 1024, name: "doc.pdf", type: "application/pdf" } as File;

    await uploadClientDocument("uid1", file);

    expect(mockedUploadBytes).toHaveBeenCalled();
    expect(mockedAddDoc).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({
        name: "doc.pdf",
        sizeBytes: 1024,
        uploadedBy: "client",
        visibility: "shared",
      })
    );
  });
});

describe("startInvoicePayment", () => {
  const fakeUser = { getIdToken: jest.fn().mockResolvedValue("fake-id-token") } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    fakeUser.getIdToken.mockResolvedValue("fake-id-token");
    global.fetch = jest.fn();
  });

  it("sends the ID token as a Bearer header and the invoiceId in the body", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ url: "https://checkout.example/abc" }),
    });

    await startInvoicePayment(fakeUser, "inv1");

    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe("/api/billing/intasend-checkout");
    expect(options.headers.Authorization).toBe("Bearer fake-id-token");
    expect(JSON.parse(options.body)).toEqual({ invoiceId: "inv1" });
  });

  it("returns the checkout url on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ url: "https://checkout.example/abc" }),
    });

    const url = await startInvoicePayment(fakeUser, "inv1");
    expect(url).toBe("https://checkout.example/abc");
  });

  it("throws the server's error message when the request fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "This invoice has already been paid." }),
    });

    await expect(startInvoicePayment(fakeUser, "inv1")).rejects.toThrow(
      "This invoice has already been paid."
    );
  });

  it("throws a generic error if the response has no url and no error message", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    await expect(startInvoicePayment(fakeUser, "inv1")).rejects.toThrow(
      ClientPortalActionError
    );
  });
});
