"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orgLogin = exports.registerOrganization = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../config/user");
const jwt_1 = require("../utils/jwt");
/* ================= REGISTER ORGANIZATION ================= */
const registerOrganization = async (req, res) => {
    try {
        const { name, email, city, district, state, pincode, registrationNumber, panNumber, about, orgType, ngoCategory, password, } = req.body;
        if (!name || !email || !city || !district || !state ||
            !pincode || !registrationNumber || !panNumber ||
            !about || !orgType || !password) {
            return res.status(400).json({ message: "All fields are mandatory" });
        }
        const exists = await user_1.pool.query("SELECT id FROM organizations WHERE email=$1", [email.toLowerCase()]);
        if (exists.rows.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await user_1.pool.query(`
      INSERT INTO organizations (
        name, email, city, district, state, pincode,
        registration_number, pan_number, about,
        org_type, ngo_category, password, status
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'pending'
      )
      `, [
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
        ]);
        return res.status(201).json({
            message: "Registration submitted. Awaiting admin approval.",
        });
    }
    catch (error) {
        console.error("Org register error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.registerOrganization = registerOrganization;
/* ================= ORGANIZATION LOGIN ================= */
const orgLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await user_1.pool.query("SELECT * FROM organizations WHERE email=$1", [email.toLowerCase()]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const org = result.rows[0];
        if (org.status !== "approved") {
            return res.status(403).json({
                message: "Organization not approved by admin yet",
            });
        }
        const match = await bcrypt_1.default.compare(password, org.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = (0, jwt_1.generateToken)({
            id: org.id,
            role: "org",
        });
        return res.json({ token, role: "org" });
    }
    catch (error) {
        console.error("Org login error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.orgLogin = orgLogin;
