import { Request, Response } from "express";
import { pool } from "../config/user";
import { AuthRequest } from "../middleware/auth.middleware";

/* ================= GET ELIGIBLE DONORS ================= */
export const getDonors = async (req: Request, res: Response) => {
  try {
    const { bloodGroup, city, district, state } = req.query;

    let query = `
      SELECT
        id,
        full_name,
        blood_group,
        city,
        district,
        state,
        mobile,
        emergency_contact,
        last_donated_at,
        last_cta_at,
        CASE
          WHEN last_donated_at IS NULL THEN 0
          ELSE GREATEST(
            0,
            90 - EXTRACT(DAY FROM (NOW() - last_donated_at))
          )
        END AS days_remaining
      FROM users
      WHERE is_donor = true
        AND (
          last_donated_at IS NULL
          OR last_donated_at <= NOW() - INTERVAL '90 days'
        )
    `;

    const values: any[] = [];
    let index = 1;

    if (bloodGroup) {
      query += ` AND blood_group = $${index++}`;
      values.push(bloodGroup);
    }
    if (city) {
      query += ` AND city ILIKE $${index++}`;
      values.push(`%${city}%`);
    }
    if (district) {
      query += ` AND district ILIKE $${index++}`;
      values.push(`%${district}%`);
    }
    if (state) {
      query += ` AND state ILIKE $${index++}`;
      values.push(`%${state}%`);
    }

    // ⭐ IMPORTANT ORDERING ⭐
    query += `
      ORDER BY
        CASE
          WHEN last_cta_at IS NULL THEN 0
          ELSE 1
        END,
        last_cta_at ASC NULLS FIRST,
        created_at DESC
    `;

    const { rows } = await pool.query(query, values);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Get donors error:", error);
    res.status(500).json({ message: "Failed to fetch donors" });
  }
};


/* ================= MARK DONATED (JWT BASED) ================= */
export const markDonated = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { donatedAt } = req.body; // YYYY-MM-DD

    // Validate date
    const donationDate = donatedAt
      ? new Date(donatedAt)
      : new Date();

    if (isNaN(donationDate.getTime())) {
      return res.status(400).json({ message: "Invalid donation date" });
    }

    // Prevent future dates
    if (donationDate > new Date()) {
      return res
        .status(400)
        .json({ message: "Donation date cannot be in the future" });
    }

    await pool.query(
      `
      UPDATE users
      SET last_donated_at = $1
      WHERE id = $2 AND is_donor = true
      `,
      [donationDate, req.user.id]
    );

    res.json({
      message: "Donation date updated successfully",
      last_donated_at: donationDate,
    });
  } catch (error) {
    console.error("markDonated error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
/* ================= LAST DONATION (JWT BASED) ================= */
export const getLastDonation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { rows } = await pool.query(
      `
      SELECT
        last_donated_at,
        CASE
          WHEN last_donated_at IS NULL THEN 0
          ELSE GREATEST(
            0,
            90 - EXTRACT(DAY FROM (NOW() - last_donated_at))
          )
        END AS days_remaining
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    res.status(200).json(rows[0] || null);
  } catch (error) {
    console.error("Get last donation error:", error);
    res.status(500).json({ message: "Failed to fetch donation info" });
  }
};
// POST /api/donors/:id/cta
export const markDonorCta = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      UPDATE users
      SET last_cta_at = NOW()
      WHERE id = $1 AND is_donor = true
      `,
      [id]
    );

    res.json({ message: "Donor moved to bottom" });
  } catch (error) {
    console.error("markDonorCta error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
