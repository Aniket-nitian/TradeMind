import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z.enum([
    "development",
    "production",
    "test"
  ]),
  API_PREFIX: z.string(),
  BROKER_ENCRYPTION_KEY: z.string().length(
    64,
    "BROKER_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)."
  ),
  MAIL_HOST: z.string(),
  MAIL_PORT: z.coerce.number(),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
  CLIENT_URL: z.string(),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  GOOGLE_CLIENT_ID: z.string(),
  RAZORPAY_KEY_ID: z.string(),
  RAZORPAY_KEY_SECRET: z.string(),
  RAZORPAY_WEBHOOK_SECRET: z.string()
});

export const env = envSchema.parse(process.env);