import jwt from "jsonwebtoken";

type TokenPayload = {
  id: string;
  role: "admin" | "org" | "user";
};

export const generateToken = (payload: TokenPayload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
