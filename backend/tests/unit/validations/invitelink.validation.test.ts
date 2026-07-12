import { describe, it, expect } from "vitest";
import { inviteLinkSchema } from "../../../src/validations/inviteLink.validation";

describe("inviteLinkSchema", () => {
  it("accepts a valid non-empty token", () => {
    const result = inviteLinkSchema.safeParse({ token: "abc123" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.token).toBe("abc123");
    }
  });

  it("rejects an empty token string", () => {
    const result = inviteLinkSchema.safeParse({ token: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("token cannot be empty");
    }
  });

  it("rejects a missing token field", () => {
    const result = inviteLinkSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("rejects a non-string token", () => {
    const result = inviteLinkSchema.safeParse({ token: 12345 });

    expect(result.success).toBe(false);
  });

  it("rejects extra unexpected fields being required elsewhere", () => {
    const result = inviteLinkSchema.safeParse({ token: "abc", extra: "field" });

    expect(result.success).toBe(true);
  });

  it("rejects a null token", () => {
    const result = inviteLinkSchema.safeParse({ token: null });

    expect(result.success).toBe(false);
  });

  it("rejects a token that is only whitespace", () => {
    const result = inviteLinkSchema.safeParse({ token: "   " });

    expect(result.success).toBe(false);
  });
});
