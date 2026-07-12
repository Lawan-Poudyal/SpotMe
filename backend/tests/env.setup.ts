import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.test") });

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is not set");
}
const dbUrl = process.env.DIRECT_URL ?? "";
if (!dbUrl.includes("spotme_test") || !dbUrl.includes("localhost")) {
  throw new Error(
    `Refusing to run tests: DATABASE_URL does not look like the local test database.\nGot: ${dbUrl}`,
  );
}
