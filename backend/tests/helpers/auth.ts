import { testAuth } from "./testAuth";

export async function createAuthenticatedUser(email: string) {
  const ctx = await testAuth.$context;
  const test = ctx.test;

  const user = test.createUser({ email, emailVerified: true });
  await test.saveUser(user);

  const { headers } = await test.login({ userId: user.id });
  const cookie = headers.get("cookie") ?? headers.get("Cookie");

  if (!cookie)
    throw new Error("testUtils login did not return a cookie header");

  return { cookie, userId: user.id };
}
