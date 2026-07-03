export function isAuthorizedSyncRequest(
  headers: Headers,
  adminPassword?: string
): boolean {
  const syncSecret = process.env.SYNC_SECRET;
  const authHeader = headers.get("authorization");
  const syncHeader = headers.get("x-sync-secret");

  if (syncSecret && syncHeader === syncSecret) return true;

  if (syncSecret && authHeader === `Bearer ${syncSecret}`) return true;

  if (adminPassword && authHeader === `Basic ${Buffer.from(`admin:${adminPassword}`).toString("base64")}`) {
    return true;
  }

  if (!syncSecret && !adminPassword && process.env.NODE_ENV === "development") {
    return true;
  }

  return false;
}

export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return process.env.NODE_ENV === "development";
  return password === adminPassword;
}
