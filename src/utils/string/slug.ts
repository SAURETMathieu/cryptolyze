/**
 * Convert a string to a URL-friendly slug
 * @param str - The string to convert
 * @returns A slugified string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Slugify a file name while preserving the extension
 * @param fileName - The file name to slugify
 * @returns A slugified file name with preserved extension
 */
export function slugifyFileName(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf(".");

  if (lastDotIndex === -1) {
    // No extension, just slugify the whole name
    return slugify(fileName);
  }

  const name = fileName.substring(0, lastDotIndex);
  const extension = fileName.substring(lastDotIndex);

  return slugify(name) + extension;
}
