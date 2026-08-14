import seedImagesMap from '../data/seedImages.json';

const seedImages = seedImagesMap as Record<string, string>;

/**
 * Resolves any image URL (Base64 data URI, HTTP link, or /uploads/... path)
 * into a valid, guaranteed-to-render image source.
 */
export function resolveImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return '';
  }

  const trimmed = url.trim();

  // 1. If it's already a Base64 data URI or external HTTP/HTTPS URL, return directly
  if (trimmed.startsWith('data:image/') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // 2. If it's an /uploads/... or uploads/... path, map to embedded base64
  const cleanFilename = trimmed.replace(/^\/?uploads\//, '');
  if (seedImages[cleanFilename]) {
    return seedImages[cleanFilename];
  }

  // Check if starts with /uploads/
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    // Try matching by filename without prefix
    const matchedKey = Object.keys(seedImages).find(k => trimmed.includes(k));
    if (matchedKey && seedImages[matchedKey]) {
      return seedImages[matchedKey];
    }
  }

  return trimmed;
}

/**
 * Safe Image Component Helper Props or Fallback URL
 */
export const DEFAULT_FALLBACK_THUMBNAIL = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="340" viewBox="0 0 600 340" fill="none"><rect width="600" height="340" fill="%23090e17"/><path d="M260 140L300 180L340 140L380 200H220L260 140Z" fill="%230284c7" fill-opacity="0.3"/><circle cx="250" cy="110" r="20" fill="%2338bdf8" fill-opacity="0.4"/><text x="300" y="240" font-family="sans-serif" font-size="14" font-weight="600" fill="%2394a3b8" text-anchor="middle">Project Showcase Preview</text></svg>';
