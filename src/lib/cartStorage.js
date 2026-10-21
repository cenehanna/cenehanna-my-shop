import { toProductCardData } from "@/lib/productSelect";

export const CART_ITEMS_KEY = "cart-items";
export const CART_UPDATED_EVENT = "cart-updated";
const MAX_CART_ITEMS = 40;

function parseCartItems(raw = "[]") {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => toProductCardData(item))
      .filter(Boolean)
      .slice(0, MAX_CART_ITEMS);
  } catch {
    return [];
  }
}

export function readCartItems() {
  if (typeof window === "undefined") return [];
  return parseCartItems(localStorage.getItem(CART_ITEMS_KEY) || "[]");
}

export function writeCartItems(items) {
  if (typeof window === "undefined") return;

  const normalizedItems = items
    .map((item) => toProductCardData(item))
    .filter(Boolean)
    .slice(0, MAX_CART_ITEMS);

  localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(normalizedItems));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function addCartItem(product) {
  const productData = toProductCardData(product);
  if (!productData) return;

  const savedItems = readCartItems();
  const updatedCart = [
    productData,
    ...savedItems.filter((item) => item.id !== productData.id),
  ].slice(0, MAX_CART_ITEMS);

  writeCartItems(updatedCart);
}

export function removeCartItem(productId) {
  const normalizedId = String(productId);
  writeCartItems(readCartItems().filter((item) => item.id !== normalizedId));
}

export function getCartItemsCount() {
  return readCartItems().length;
}

export function isProductInCart(productId) {
  const normalizedId = String(productId);
  return readCartItems().some((item) => item.id === normalizedId);
}
