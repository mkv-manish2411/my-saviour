import cron from "node-cron";
import { pool } from "../config/user";
import { sendEligibilityEmail } from "../services/email.service";


export function startEligibilityReminderJob() {
  // Runs daily at 9 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("⏰ Running eligibility reminder job");

    const { rows } = await pool.query(`
      SELECT id, full_name, email, mobile
      FROM users
      WHERE is_donor = true
        AND last_donated_at IS NOT NULL
        AND eligibility_notified = false
        AND last_donated_at::date = CURRENT_DATE - INTERVAL '90 days'
    `);

    for (const user of rows) {
      try {
        if (user.email) {
          await sendEligibilityEmail(user.email, user.full_name);
        }

        

        await pool.query(
          `UPDATE users
           SET eligibility_notified = true
           WHERE id = $1`,
          [user.id]
        );

        console.log(`✅ Reminder sent to ${user.full_name}`);
      } catch (err) {
        console.error(`❌ Failed for ${user.id}`, err);
      }
    }
  });
}
