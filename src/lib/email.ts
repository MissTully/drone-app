const EMAIL_PATTERN =
  /^[a-z0-9._%+-]{1,64}@[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?)+$/i

export function normalizeEmail(value: string): string | null {
  const email = value.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().toLowerCase()
  if (email.length < 6 || email.length > 254) return null
  if (email.includes('..')) return null
  if (!EMAIL_PATTERN.test(email)) return null
  return email
}
