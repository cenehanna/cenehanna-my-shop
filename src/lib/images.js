// src/lib/images.js
export const PLACEHOLDER = "/placeholder.svg";
export const ORACLE_OBJECT_STORAGE_BASE =
  "https://objectstorage.eu-marseille-1.oraclecloud.com/n/axojpmluqbww/b/cenehanna-images/o/";

export function resolveImageSrc(src) {
  if (typeof src !== "string") return src;

  const localImagePath = src.match(/^\/?images\/(.+)$/);
  if (!localImagePath) return src;

  return `${ORACLE_OBJECT_STORAGE_BASE}${encodeURIComponent(`products/${localImagePath[1]}`)}`;
}

export function isOracleObjectStorageImage(src) {
  return typeof src === "string" && src.startsWith(ORACLE_OBJECT_STORAGE_BASE);
}

/**
 * Повертає перше фото або заглушку.
 * @param {string[] | string | undefined} images
 * @returns {string}
 */
export function getFirstImage(images) {
  const image = Array.isArray(images) ? images[0] : images;
  return resolveImageSrc(image || PLACEHOLDER);
}

/**
 * Повертає фото за індексом або заглушку.
 */
export function getImage(images, index = 0) {
  return resolveImageSrc(images?.[index] || PLACEHOLDER);
}
