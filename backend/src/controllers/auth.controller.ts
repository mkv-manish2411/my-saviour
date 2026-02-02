import { Request, Response } from "express";
import { pool } from "../config/user";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { registerSchema, loginSchema } from "../validators/auth.validator";

/* ================= REGISTER ================= */
export const registerUser = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input data",
      errors: parsed.error.flatten(),
    });
  }

  const data = parsed.data;
  const passwordHash = await hashPassword(data.password);

  try {
    const result = await pool.query(
      `
      INSERT INTO users
      (full_name, email, mobile, password_hash,
       city, district, state, pincode,
       aadhar, blood_group, emergency_contact, is_donor)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING id
      `,
      [
        data.fullName,
        data.email,
        data.mobile,
        passwordHash,
        data.city,
        data.district,
        data.state,
        data.pincode,
        data.aadhar,
        data.bloodGroup,
        data.emergencyContact,
        data.isDonor,
      ]
    );

    const token = generateToken(result.rows[0].id);

    res.status(201).json({
      success: true,
      token,
    });
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Email already registered" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN ================= */
export const loginUser = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const { email, password } = parsed.data;

  const user = await pool.query(
    "SELECT id, password_hash FROM users WHERE email=$1",
    [email]
  );

  if (!user.rows.length) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isValid = await comparePassword(
    password,
    user.rows[0].password_hash
  );

  if (!isValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = generateToken(user.rows[0].id);

  res.status(200).json({
    success: true,
    token,
  });
};
