import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { env } from "../../config/env.js";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getKey(): Buffer {
    return Buffer.from(env.BROKER_ENCRYPTION_KEY, "hex");
}

export function encrypt(plainText: string): string {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, getKey(), iv);

    const ciphertext = Buffer.concat([
        cipher.update(plainText, "utf8"),
        cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return [
        iv.toString("hex"),
        authTag.toString("hex"),
        ciphertext.toString("hex"),
    ].join(":");
}

export function decrypt(payload: string): string {
    const [ivHex, authTagHex, ciphertextHex] = payload.split(":");

    if (!ivHex || !authTagHex || !ciphertextHex) {
        throw new Error("Invalid encrypted payload format.");
    }

    const decipher = createDecipheriv(
        ALGORITHM,
        getKey(),
        Buffer.from(ivHex, "hex")
    );

    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

    const plaintext = Buffer.concat([
        decipher.update(Buffer.from(ciphertextHex, "hex")),
        decipher.final(),
    ]);

    return plaintext.toString("utf8");
}
