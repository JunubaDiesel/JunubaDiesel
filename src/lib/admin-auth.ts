export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!password.trim()) return false;
  const authHeader = `Basic ${btoa(`admin:${password}`)}`;
  const res = await fetch("/api/admin/verify", {
    headers: { Authorization: authHeader },
  });
  return res.ok;
}
