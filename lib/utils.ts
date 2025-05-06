import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Image utility functions
export const imageCache = new Map<string, string>();

// Function to check if an image exists and is accessible
export async function checkImageExists(url: string): Promise<boolean> {
  if (imageCache.has(url)) {
    return true;
  }

  try {
    const response = await fetch(url, { method: 'HEAD' });
    const exists = response.ok;

    if (exists) {
      imageCache.set(url, url);
    }

    return exists;
  } catch (error) {
    console.error(`Error checking if image exists: ${url}`, error);
    return false;
  }
}

// Function to get a valid image URL with fallbacks
export async function getValidImageUrl(url: string, fallbacks: string[] = []): Promise<string> {
  // If the URL is already in the cache, return it
  if (imageCache.has(url)) {
    return imageCache.get(url)!;
  }

  // Check if the primary URL exists
  const exists = await checkImageExists(url);
  if (exists) {
    imageCache.set(url, url);
    return url;
  }

  // Try fallbacks in order
  for (const fallback of fallbacks) {
    const fallbackExists = await checkImageExists(fallback);
    if (fallbackExists) {
      imageCache.set(url, fallback); // Cache the mapping from original to fallback
      return fallback;
    }
  }

  // If all else fails, return a default SVG placeholder
  const defaultPlaceholder = '/images/properties/property-placeholder.svg';
  imageCache.set(url, defaultPlaceholder);
  return defaultPlaceholder;
}

// Function to format price with thousand separator
export function formatPrice(price: string | number, currency: string = 'USD'): string {
  if (!price) return 'Price on request';

  const numericPrice = typeof price === 'string' ? parseInt(price) : price;
  if (isNaN(numericPrice)) return 'Price on request';

  if (currency === "CNY") {
    return `¥${numericPrice.toLocaleString()}`;
  } else if (currency === "UGX") {
    return `UGX ${numericPrice.toLocaleString()}`;
  }

  return `$${numericPrice.toLocaleString()}`;
}
