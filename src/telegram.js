import crypto from "node:crypto";

export function verifyTelegramInitData(initData, botToken, maxAgeSeconds = 3600) {
  if (!initData || !botToken) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  const authDate = Number(params.get("auth_date"));
  if (!hash || !Number.isFinite(authDate)) return null;
  if (Math.abs(Date.now() / 1000 - authDate) > maxAgeSeconds) return null;

  params.delete("hash");
  params.delete("signature");
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const calculated = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
  const a = Buffer.from(calculated, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const user = JSON.parse(params.get("user") || "null");
    if (!user?.id) return null;
    return user;
  } catch {
    return null;
  }
}
