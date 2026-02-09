"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    mobile: zod_1.z.string().min(10),
    password: zod_1.z.string().min(8),
    city: zod_1.z.string(),
    district: zod_1.z.string(),
    state: zod_1.z.string(),
    pincode: zod_1.z.string(),
    aadhar: zod_1.z.string().length(12),
    bloodGroup: zod_1.z.enum([
        "A+", "A-", "B+", "B-",
        "AB+", "AB-", "O+", "O-"
    ]),
    emergencyContact: zod_1.z.string().min(10),
    isDonor: zod_1.z.boolean(),
    termsAccepted: zod_1.z.literal(true),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
