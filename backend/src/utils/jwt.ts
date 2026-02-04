import jwt from "jsonwebtoken";

type TokenPayload = {
  id: string;
  role: "admin" | "org";
};

export const generateToken = (payload: TokenPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};
