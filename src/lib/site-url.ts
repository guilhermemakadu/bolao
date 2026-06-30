export function buildSiteUrl(host: string, protocol: string): string {
  return `${protocol}://${host}`;
}

export function buildPasswordResetRedirectUrl(siteUrl: string): string {
  return `${siteUrl}/auth/callback?next=/redefinir-senha`;
}
