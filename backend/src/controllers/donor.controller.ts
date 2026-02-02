import { Request, Response } from "express";
import { pool } from "../config/user";

export const getDonors = async (req: Request, res: Response) => {
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
      emergency_contact
    FROM users
    WHERE is_donor = true
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

  query += " ORDER BY created_at DESC";

  const result = await pool.query(query, values);
  res.json(result.rows);
};
