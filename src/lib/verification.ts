export function extractDomain(url: string): string | null {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return parsed.hostname.replace("www.", "");
  } catch {
    return null;
  }
}

export function emailMatchesDomain(email: string, websiteUrl: string): boolean {
  const emailDomain = email.split("@")[1]?.toLowerCase();
  const siteDomain = extractDomain(websiteUrl);
  if (!emailDomain || !siteDomain) return false;
  return emailDomain === siteDomain;
}

export function isGenericEmail(email: string): boolean {
  const generic = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "aol.com", "protonmail.com", "live.com", "btinternet.com", "sky.com", "virginmedia.com"];
  const domain = email.split("@")[1]?.toLowerCase();
  return generic.includes(domain || "");
}
