"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const user_1 = require("../config/user");
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const auth_validator_1 = require("../validators/auth.validator");
/* ================= REGISTER ================= */
const registerUser = async (req, res) => {
    const parsed = auth_validator_1.registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: "Invalid input data",
            errors: parsed.error.flatten(),
        });
    }
    const data = parsed.data;
    const passwordHash = await (0, hash_1.hashPassword)(data.password);
    try {
        const result = await user_1.pool.query(`
      INSERT INTO users
      (full_name, email, mobile, password_hash,
       city, district, state, pincode,
       aadhar, blood_group, emergency_contact, is_donor)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING id
      `, [
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
        ]);
        const token = (0, jwt_1.generateToken)(result.rows[0].id);
        res.status(201).json({
            success: true,
            token,
        });
    }
    catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({ message: "Email already registered" });
        }
        res.status(500).json({ message: "Server error" });
    }
};
exports.registerUser = registerUser;
/* ================= LOGIN ================= */
const loginUser = async (req, res) => {
    const parsed = auth_validator_1.loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const { email, password } = parsed.data;
    const user = await user_1.pool.query("SELECT id, password_hash FROM users WHERE email=$1", [email]);
    if (!user.rows.length) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const isValid = await (0, hash_1.comparePassword)(password, user.rows[0].password_hash);
    if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = (0, jwt_1.generateToken)(user.rows[0].id);
    res.status(200).json({
        success: true,
        token,
    });
};
exports.loginUser = loginUser;
