import "dotenv/config";
import app from "./app";
import { pool } from "./config/user";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database query test passed");
  } catch (err: any) {
    console.error("❌ Database query failed:", err.message);
  }
})();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
