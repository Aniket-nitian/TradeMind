import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { AppError } from "../exceptions/AppError.js";

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("\n========== ERROR ==========");
  console.error(error);
  console.error("===========================\n");

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: error.flatten(),
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: error.message,
  });
}