"use server";

import { getProductsByIds } from "@/app/actions/getProductsByIds";
import { parseFavoriteIds } from "@/lib/favoritesStorage";

export async function getFavoriteProducts(ids) {
  return getProductsByIds(parseFavoriteIds(JSON.stringify(ids ?? [])));
}
