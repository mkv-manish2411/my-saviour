import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  mobile: z.string().min(10),
  password: z.string().min(8),

  city: z.string(),
  district: z.string(),
  state: z.string(),
  pincode: z.string(),

  aadhar: z.string().length(12),
  bloodGroup: z.enum([
    "A+", "A-", "B+", "B-",
    "AB+", "AB-", "O+", "O-"
  ]),
  emergencyContact: z.string().min(10),

  isDonor: z.boolean(),
  termsAccepted: z.literal(true),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
