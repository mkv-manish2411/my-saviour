"use strict";
// import { Pool } from "pg";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
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
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});
exports.pool.on("connect", () => {
    console.log("✅ PostgreSQL connected successfully");
});
