import { describe, it, expect } from "vitest";
import { saveUploadSchema } from "../../../src/validations/upload.validation"; // Adjust path as needed

describe("saveUploadSchema", () => {
  const validPayload = {
    eventId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    photos: [
      {
        url: "https://example.com/photo1.jpg",
        publicId: "cloudinary_id_abc123",
        width: 1920,
        height: 1080,
      },
    ],
  };

  it("accepts a completely valid payload", () => {
    const result = saveUploadSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  describe("eventId validation", () => {
    it("rejects an empty or whitespace-only eventId", () => {
      const result = saveUploadSchema.safeParse({
        ...validPayload,
        eventId: "   ",
      });
      expect(result.success).toBe(false);
    });

    it("rejects a missing or null eventId", () => {
      const result = saveUploadSchema.safeParse({
        ...validPayload,
        eventId: undefined,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("photos array boundaries", () => {
    it("rejects an empty photos array (under min limit)", () => {
      const result = saveUploadSchema.safeParse({
        ...validPayload,
        photos: [],
      });
      expect(result.success).toBe(false);
    });

    it("rejects if there are more than 20 photos (over max limit)", () => {
      const singlePhoto = validPayload.photos[0];
      const twentyOnePhotos = Array(21).fill(singlePhoto);

      const result = saveUploadSchema.safeParse({
        ...validPayload,
        photos: twentyOnePhotos,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("individual photo properties", () => {
    it("rejects an invalid URL format", () => {
      const result = saveUploadSchema.safeParse({
        ...validPayload,
        photos: [{ ...validPayload.photos[0], url: "not-a-valid-url" }],
      });
      expect(result.success).toBe(false);
    });

    it("rejects an empty or overly long publicId", () => {
      const emptyIdResult = saveUploadSchema.safeParse({
        ...validPayload,
        photos: [{ ...validPayload.photos[0], publicId: "" }],
      });

      const longIdResult = saveUploadSchema.safeParse({
        ...validPayload,
        photos: [{ ...validPayload.photos[0], publicId: "a".repeat(256) }],
      });

      expect(emptyIdResult.success).toBe(false);
      expect(longIdResult.success).toBe(false);
    });

    it("rejects non-positive, zero, or decimal dimensions", () => {
      const zeroWidthResult = saveUploadSchema.safeParse({
        ...validPayload,
        photos: [{ ...validPayload.photos[0], width: 0 }], // positive() fails on 0
      });

      const negativeHeightResult = saveUploadSchema.safeParse({
        ...validPayload,
        photos: [{ ...validPayload.photos[0], height: -50 }],
      });

      const decimalWidthResult = saveUploadSchema.safeParse({
        ...validPayload,
        photos: [{ ...validPayload.photos[0], width: 1080.5 }], // int() fails on decimals
      });

      expect(zeroWidthResult.success).toBe(false);
      expect(negativeHeightResult.success).toBe(false);
      expect(decimalWidthResult.success).toBe(false);
    });
  });
});
