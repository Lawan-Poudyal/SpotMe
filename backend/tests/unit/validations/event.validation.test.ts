import { describe, it, expect } from "vitest";
import { updateEventSchema } from "../../../src/validations/event.validation";

describe("updateEventSchema", () => {
  const validPayload = {
    eventId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    eventName: "rendezvous123",
    thumbNailId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  };

  it("accepts a valid payload", () => {
    const result = updateEventSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects empty strings for required fields", () => {
    const result = updateEventSchema.safeParse({
      ...validPayload,
      eventName: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing required field", () => {
    const { eventId, ...invalidPayload } = validPayload;
    const result = updateEventSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });

  it("rejects non-string types for fields", () => {
    const result = updateEventSchema.safeParse({
      ...validPayload,
      eventName: 12345,
    });
    expect(result.success).toBe(false);
  });

  it("accepts extra unexpected fields (strips or ignores them depending on zod config)", () => {
    const result = updateEventSchema.safeParse({
      ...validPayload,
      extra: "field",
    });
    expect(result.success).toBe(true);
  });

  it("rejects null values for required fields", () => {
    const result = updateEventSchema.safeParse({
      ...validPayload,
      thumbNailId: null,
    });
    expect(result.success).toBe(false);
  });

  it("rejects fields that are only whitespace", () => {
    const result = updateEventSchema.safeParse({
      ...validPayload,
      eventName: "   ",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid UUID formats for ID fields", () => {
    const result = updateEventSchema.safeParse({
      ...validPayload,
      eventId: "not-a-valid-uuid",
    });
    expect(result.success).toBe(false);
  });
});
