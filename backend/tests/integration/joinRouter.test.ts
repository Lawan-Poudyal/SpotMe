import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/config/prismaClientConfig";
import { createAuthenticatedUser } from "../helpers/auth";

describe("POST /api/invite-links/:token/join", () => {
  let cookie: string;
  let userId: string;
  let eventId: string;
  let validToken: string;

  beforeEach(async () => {
    await prisma.participant.deleteMany();
    await prisma.inviteLink.deleteMany();
    await prisma.event.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    const auth = await createAuthenticatedUser("joiner@test.com");
    cookie = auth.cookie;
    userId = auth.userId;

    const organizer = await prisma.user.create({
      data: {
        email: "organizer@test.com",
        name: "Organizer",
        emailVerified: true,
      },
    });

    const event = await prisma.event.create({
      data: { eventName: "Test Event", userId: organizer.id },
    });
    eventId = event.id;

    const invite = await prisma.inviteLink.create({
      data: { eventId, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
    });
    validToken = invite.token;
  });

  it("lets an authenticated user join with a valid token", async () => {
    const res = await request(app)
      .post(`/api/invite-links/{validToken}/join`)
      .set("Cookie", cookie);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ success: true, data: { eventId } });

    const participant = await prisma.participant.findFirst({
      where: { eventId, userId },
    });
    expect(participant).not.toBeNull();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await request(app).post(`/api/invite-links/${validToken}/join`);

    expect(res.status).toBe(401);
  });

  it("rejects a nonexistent token", async () => {
    const res = await request(app)
      .post("/api/invite-links/does-not-exist/join")
      .set("Cookie", cookie);

    expect(res.status).toBe(404);
  });

  it("rejects an empty token", async () => {
    const res = await request(app)
      .post("/api/invite-links/ /join")
      .set("Cookie", cookie);

    expect(res.status).toBe(400);
  });

  it("does not error on joining twice (idempotent upsert)", async () => {
    await request(app)
      .post(`/api/invite-links/${validToken}/join`)
      .set("Cookie", cookie);

    const res = await request(app)
      .post(`/api/invite-links/${validToken}/join`)
      .set("Cookie", cookie);

    expect(res.status).toBe(201);

    const participants = await prisma.participant.findMany({
      where: { eventId, userId },
    });
    expect(participants).toHaveLength(1);
  });
});
