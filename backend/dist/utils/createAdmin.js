"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // 🔴 REQUIRED FOR ts-node scripts
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../config/user");
const createAdmin = async () => {
    try {
        const email = "admin@mysavior.com";
        const plainPassword = "Admin@123";
        console.log("DB PASSWORD:", process.env.DB_PASSWORD); // TEMP DEBUG
        const existing = await user_1.pool.query("SELECT id FROM admins WHERE email = $1", [email]);
        if (existing.rows.length > 0) {
            console.log("✅ Admin already exists");
            process.exit(0);
        }
        const hash = await bcrypt_1.default.hash(plainPassword, 10);
        await user_1.pool.query("INSERT INTO admins (email, password) VALUES ($1, $2)", [email, hash]);
        console.log("🚀 Admin created successfully");
        process.exit(0);
    }
    catch (err) {
        console.error("❌ Error creating admin:", err);
        process.exit(1);
    }
};
createAdmin();
