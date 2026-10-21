// src/lib/images.js
export const PLACEHOLDER = "/placeholder.svg";

/**
 * Повертає перше фото або заглушку.
 * @param {string[] | string | undefined} images
 * @returns {string}
 */
export function getFirstImage(images) {
  const image = Array.isArray(images) ? images[0] : images;
  return image || PLACEHOLDER;
}

/**
 * Повертає фото за індексом або заглушку.
 */
export function getImage(images, index = 0) {
  return images?.[index] || PLACEHOLDER;
}
