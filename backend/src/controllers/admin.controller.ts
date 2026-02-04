import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../config/user";
import { generateToken } from "../utils/jwt";

/* ================= ADMIN LOGIN ================= */
export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM admins WHERE email=$1",
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const admin = result.rows[0];
  const match = await bcrypt.compare(password, admin.password);

  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken({
    id: admin.id,
    role: "admin",
  });

  return res.json({ token, role: "admin" });
};

/* ================= GET PENDING ORGS ================= */
export const getPendingOrgs = async (_: Request, res: Response) => {
  const result = await pool.query(
    "SELECT * FROM organizations WHERE status='pending' ORDER BY created_at DESC"
  );

  return res.json(result.rows);
};

/* ================= APPROVE ORG ================= */
export const approveOrg = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await pool.query(
    "UPDATE organizations SET status='approved' WHERE id=$1 RETURNING id",
    [id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Organization not found" });
  }

  return res.json({ message: "Organization approved" });
};
