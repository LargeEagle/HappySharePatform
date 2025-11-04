import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// 明確加載環境變數
config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
