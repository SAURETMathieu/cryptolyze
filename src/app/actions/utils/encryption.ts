import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
  ? (Buffer.from(
      process.env.ENCRYPTION_KEY,
      "hex"
    ) as unknown as crypto.CipherKey)
  : null;
const IV_LENGTH = 16;

export function encrypt(text: string) {
  try {
    if (!ENCRYPTION_KEY) {
      throw new Error("ENCRYPTION_KEY is not set");
    }
    const iv = crypto.randomBytes(IV_LENGTH) as any;
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
  } catch (e) {
    return null;
  }
}

export function decrypt(encryptedText: string) {
  try {
    if (!ENCRYPTION_KEY) {
      throw new Error("ENCRYPTION_KEY is not set");
    }
    const [ivHex, encryptedData] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex") as any;
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (e) {
    return null;
  }
}
