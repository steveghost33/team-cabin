const ALLOWED_EXTERNAL_PROTOCOLS = new Set(['https:']);

export function getSafeExternalUrl(value) {
  if (typeof value !== 'string') {
    return null;
  }

  try {
    const url = new URL(value);
    return ALLOWED_EXTERNAL_PROTOCOLS.has(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
