import dotenv from "dotenv";
dotenv.config(); // 🔴 REQUIRED FOR ts-node scripts

import bcrypt from "bcrypt";
import { pool } from "../config/user";

const createAdmin = async () => {
  try {
    const email = "admin@mysavior.com";
    const plainPassword = "Admin@123";

    console.log("DB PASSWORD:", process.env.DB_PASSWORD); // TEMP DEBUG

    const existing = await pool.query(
      "SELECT id FROM admins WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      console.log("✅ Admin already exists");
      process.exit(0);
    }

    const hash = await bcrypt.hash(plainPassword, 10);

    await pool.query(
      "INSERT INTO admins (email, password) VALUES ($1, $2)",
      [email, hash]
    );

    console.log("🚀 Admin created successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
