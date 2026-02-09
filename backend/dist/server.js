"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const user_1 = require("./config/user");
const PORT = process.env.PORT || 5000;
(async () => {
    try {
        await user_1.pool.query("SELECT 1");
        console.log("✅ Database query test passed");
    }
    catch (err) {
        console.error("❌ Database query failed:", err.message);
    }
})();
app_1.default.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
