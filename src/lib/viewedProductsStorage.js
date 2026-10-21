export const VIEWED_PRODUCTS_KEY = "viewed-products";
export const VIEWED_PRODUCTS_UPDATED_EVENT = "viewed-products-updated";
const MAX_VIEWED_PRODUCTS = 40;

function normalizeViewedIds(parsed) {
  if (!Array.isArray(parsed)) return [];

  return [
    ...new Set(
      parsed
        .map((entry) => {
          if (typeof entry === "string") return entry.trim();
          if (entry && typeof entry === "object" && entry.id) {
            return String(entry.id).trim();
          }
          return "";
        })
        .filter(Boolean),
    ),
  ].slice(0, MAX_VIEWED_PRODUCTS);
}

export function readViewedProductIds() {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(localStorage.getItem(VIEWED_PRODUCTS_KEY) || "[]");
    return normalizeViewedIds(parsed);
  } catch {
    return [];
  }
}

export function writeViewedProductIds(ids) {
  if (typeof window === "undefined") return;

  const normalizedIds = normalizeViewedIds(ids);
  localStorage.setItem(VIEWED_PRODUCTS_KEY, JSON.stringify(normalizedIds));
  window.dispatchEvent(new Event(VIEWED_PRODUCTS_UPDATED_EVENT));
}

export function addViewedProductId(productId) {
  const normalizedId = String(productId).trim();
  if (!normalizedId) return;

  const savedIds = readViewedProductIds();
  writeViewedProductIds([
    normalizedId,
    ...savedIds.filter((id) => id !== normalizedId),
  ]);
}
