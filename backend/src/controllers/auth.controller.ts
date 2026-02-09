import { Request, Response, NextFunction } from "express";
import { pool } from "../config/user";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};


export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { rows } = await pool.query(
      `
      SELECT
        id,
        full_name,
        email,
        mobile,
        blood_group,
        city,
        district,
        state,
        emergency_contact
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error("getMe error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* ================= REGISTER ================= */


export const registerUser = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      messawge: "Invalid input data",
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
       aadhar, blood_group, emergency_contact, is_donor, role)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING id, role
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
        "user", // default role
      ]
    );

    const token = generateToken({
      id: result.rows[0].id,
      role: result.rows[0].role,
    });

    res.status(201).json({
      success: true,
      token,
    });
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Email already registered" });
    }

    console.error(error);
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
    `SELECT id, role, password_hash FROM users WHERE email=$1`,
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

  const token = generateToken({
    id: user.rows[0].id,
    role: user.rows[0].role,
  });

  res.status(200).json({
    success: true,
    token,
  });
};


