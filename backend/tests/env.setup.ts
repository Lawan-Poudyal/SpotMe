import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.test") });

const dbUrl = process.env.DATABASE_URL ?? "";
if (!dbUrl.includes("spotme_test") || !dbUrl.includes("localhost")) {
  throw new Error(
    `Refusing to run tests: DATABASE_URL does not look like the local test database.\nGot: ${dbUrl}`,
  );
}
