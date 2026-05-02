/** Demo admin accounts (frontend only). Replace with real auth in production. */
export const ADMIN_CREDENTIALS = [
  { email: "test@admin.com", password: "123456" },
  { email: "admin@lmshowroom.com", password: "admin123" },
];

export function matchAdminCredential(email, password) {
  const e = email.trim().toLowerCase();
  return ADMIN_CREDENTIALS.find((c) => c.email === e && c.password === password) || null;
}
