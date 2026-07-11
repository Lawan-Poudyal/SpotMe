import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/config/prismaClientConfig";
import { createAuthenticatedUser } from "../helpers/auth";

describe("GET /api/event/photo", () => {
  let cookie: string;
  let userId: string;
  let eventId: string;

  beforeEach(async () => {
    await prisma.participant.deleteMany();
    await prisma.inviteLink.deleteMany();
    await prisma.event.deleteMany();
    await prisma.photo.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    const auth = await createAuthenticatedUser("asksPhoto@test.com");
    cookie = auth.cookie;
    userId = auth.userId;

    const organizer = await prisma.user.create({
      data: {
        email: `organizer-${crypto.randomUUID()}@test.com`,
        name: "Organizer",
        emailVerified: true,
      },
    });
    const event = await prisma.event.create({
      data: { eventName: "Test Event", userId: organizer.id },
    });
    eventId = event.id;
  });

  it("lets an authenticated user with valid authorization", async () => {
    const photo = await prisma.photo.create({
      data: {
        photo_url: "http://example.com/a.jpg",
        event_id: eventId,
        uploaded_by: userId,
        public_id: "abc123",
        width: 100,
        height: 100,
      },
    });

    const res = await request(app)
      .get(`/api/event/photo?eventId=${eventId}`)
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: [
        expect.objectContaining({
          id: photo.id,
          photo_url: photo.photo_url,
          event_id: eventId,
          uploaded_by: userId,
          public_id: "abc123",
          width: 100,
          height: 100,
        }),
      ],
    });
  });

  it("rejects an unauthenticated request", async () => {
    const res = await request(app).get(`/api/event/photo?eventId=${eventId}`);
    expect(res.status).toBe(401);
  });

  it("rejects empty query parameter", async () => {
    const res = await request(app).get(`/api/event/photo?eventid=${eventId}`);
    expect(res.status).toBe(400);
  });

  it("rejects non existent event Id", async () => {
    const res = await request(app)
      .get("/api/event/photo?eventId=abcsdfwe")
      .set("Cookie", cookie);

    expect(res.status).toBe(400);
  });
});
