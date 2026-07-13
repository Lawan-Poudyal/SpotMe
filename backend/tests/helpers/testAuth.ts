// tests/helpers/testAuth.ts
import { betterAuth } from "better-auth";
import { testUtils } from "better-auth/plugins";
import { baseConfig } from "../../src/config/auth.js";

export const testAuth = betterAuth({
  ...baseConfig,
  plugins: [testUtils()],
});
