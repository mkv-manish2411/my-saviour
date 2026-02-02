// import { Pool } from "pg";

// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === "production"
//     ? { rejectUnauthorized: false }
//     : false,
// });

// pool.on("connect", () => {
//   console.log("✅ PostgreSQL connected successfully");
// });

// pool.on("error", (err) => {
//   console.error("❌ PostgreSQL connection error:", err.message);
// });
import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // MUST be string
});

pool.on("connect", () => {
  console.log("✅ PostgreSQL connected successfully");
});
