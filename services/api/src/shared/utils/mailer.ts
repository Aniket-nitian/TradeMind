import nodemailer from "nodemailer";
import { env } from "../../config/env.js";

const transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    secure: env.MAIL_PORT === 465,
    auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS,
    },
});

export async function sendMail(options: {
    to: string;
    subject: string;
    html: string;
}) {
    await transporter.sendMail({
        from: `"TradeMind AI" <${env.MAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
    });
}
