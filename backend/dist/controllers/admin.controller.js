"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveOrg = exports.getPendingOrgs = exports.adminLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../config/user");
const jwt_1 = require("../utils/jwt");
/* ================= ADMIN LOGIN ================= */
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    const result = await user_1.pool.query("SELECT * FROM admins WHERE email=$1", [email.toLowerCase()]);
    if (result.rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const admin = result.rows[0];
    const match = await bcrypt_1.default.compare(password, admin.password);
    if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = (0, jwt_1.generateToken)({
        id: admin.id,
        role: "admin",
    });
    return res.json({ token, role: "admin" });
};
exports.adminLogin = adminLogin;
/* ================= GET PENDING ORGS ================= */
const getPendingOrgs = async (_, res) => {
    const result = await user_1.pool.query("SELECT * FROM organizations WHERE status='pending' ORDER BY created_at DESC");
    return res.json(result.rows);
};
exports.getPendingOrgs = getPendingOrgs;
/* ================= APPROVE ORG ================= */
const approveOrg = async (req, res) => {
    const { id } = req.params;
    const result = await user_1.pool.query("UPDATE organizations SET status='approved' WHERE id=$1 RETURNING id", [id]);
    if (result.rowCount === 0) {
        return res.status(404).json({ message: "Organization not found" });
    }
    return res.json({ message: "Organization approved" });
};
exports.approveOrg = approveOrg;
