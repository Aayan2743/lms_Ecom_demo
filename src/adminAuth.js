/** Demo admin accounts (frontend only). Replace with real auth in production. */
export const ADMIN_CREDENTIALS = [
  { email: "admin@fabricforever.in", password: "admin123" },
  { email: "test@fabricforever.in", password: "123456" },
];

export function matchAdminCredential(email, password) {
  const e = email.trim().toLowerCase();
  return ADMIN_CREDENTIALS.find((c) => c.email === e && c.password === password) || null;
}
