export function looksLikeOemCode(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/^\d{5}-\d{5}/.test(trimmed)) return true;
  if (/^0[KkA-Za-z]\d/.test(trimmed)) return true;
  if (/^\d{3}-\d{3}/.test(trimmed)) return true;
  if (/^[A-Z0-9-]{6,}$/i.test(trimmed) && /\d/.test(trimmed)) return true;
  return false;
}
