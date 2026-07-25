import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (userId: string) => {
  return jwt.sign(
    { userId },
    ACCESS_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"],
    }
  );
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    { userId },
    REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"],
    }
  );
};

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, ACCESS_SECRET);

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, REFRESH_SECRET);