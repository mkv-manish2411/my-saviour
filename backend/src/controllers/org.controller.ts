import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../config/user";
import { generateToken } from "../utils/jwt";

/* ================= REGISTER ORGANIZATION ================= */
export const registerOrganization = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      city,
      district,
      state,
      pincode,
      registrationNumber,
      panNumber,
      about,
      orgType,
      ngoCategory,
      password,
    } = req.body;

    if (
      !name || !email || !city || !district || !state ||
      !pincode || !registrationNumber || !panNumber ||
      !about || !orgType || !password
    ) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }

    const exists = await pool.query(
      "SELECT id FROM organizations WHERE email=$1",
      [email.toLowerCase()]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `
      INSERT INTO organizations (
        name, email, city, district, state, pincode,
        registration_number, pan_number, about,
        org_type, ngo_category, password, status
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'pending'
      )
      `,
      [
        name,
        email.toLowerCase(),
        city,
        district,
        state,
        pincode,
        registrationNumber,
        panNumber,
        about,
        orgType,
        ngoCategory || null,
        hashedPassword,
      ]
    );

    return res.status(201).json({
      message: "Registration submitted. Awaiting admin approval.",
    });
  } catch (error) {
    console.error("Org register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= ORGANIZATION LOGIN ================= */
export const orgLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM organizations WHERE email=$1",
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const org = result.rows[0];

    if (org.status !== "approved") {
      return res.status(403).json({
        message: "Organization not approved by admin yet",
      });
    }

    const match = await bcrypt.compare(password, org.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: org.id,
      role: "org",
    });

    return res.json({ token, role: "org" });
  } catch (error) {
    console.error("Org login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
