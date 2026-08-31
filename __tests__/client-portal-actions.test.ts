import {
  ClientPortalActionError,
  sendClientMessage,
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
