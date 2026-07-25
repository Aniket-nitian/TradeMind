import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export type AuthRequest = Request;

export const authGuard = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const token = header.split(" ")[1];

    const payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!
    ) as {
      userId: string;
    };

    req.userId = payload.userId;

    next();
  } catch(error) {
     console.log(error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};