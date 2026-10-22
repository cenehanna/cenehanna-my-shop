"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./ProductGrid.module.css";

export default function ActiveFilterTags({
  colors,
  productTypes,
  minPrice,
  maxPrice,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedColors = searchParams.getAll("color");
  const selectedProductTypes = searchParams.getAll("productType");
  const hasPriceFilter = minPrice !== undefined || maxPrice !== undefined;

  if (
    selectedColors.length === 0 &&
    selectedProductTypes.length === 0 &&
    !hasPriceFilter
  ) {
    return null;
  }

  const removeFilter = (key, value) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (value === undefined) {
      nextParams.delete(key);
    } else {
      const remainingValues = nextParams
        .getAll(key)
        .filter((item) => item !== value);
      nextParams.delete(key);
      for (const item of remainingValues) {
        nextParams.append(key, item);
      }
    }
    nextParams.delete("page");

    const queryString = nextParams.toString();
    router.push(
      `${pathname || "/catalog"}${queryString ? `?${queryString}` : ""}`,
    );
  };

  const removePriceFilter = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("minPrice");
    nextParams.delete("maxPrice");
    nextParams.delete("page");

    const queryString = nextParams.toString();
    router.push(
      `${pathname || "/catalog"}${queryString ? `?${queryString}` : ""}`,
    );
  };

  const colorLabels = new Map(colors.map(({ value, label }) => [value, label]));
  const productTypeLabels = new Map(
    productTypes.map(({ value, label }) => [value, label]),
  );
  const priceLabel =
    minPrice !== undefined && maxPrice !== undefined
      ? `₴${minPrice}–₴${maxPrice}`
      : minPrice !== undefined
        ? `From ₴${minPrice}`
        : `Up to ₴${maxPrice}`;

  return (
    <div className={styles.filterTags}>
      {selectedProductTypes.map((productType) => (
        <button
          key={`type-${productType}`}
          type="button"
          className={styles.filterTag}
          onClick={() => removeFilter("productType", productType)}
          aria-label={`Remove ${productTypeLabels.get(productType) || productType} filter`}
        >
          {productTypeLabels.get(productType) || productType}{" "}
          <span aria-hidden="true">×</span>
        </button>
      ))}
      {selectedColors.map((color) => (
        <button
          key={`color-${color}`}
          type="button"
          className={styles.filterTag}
          onClick={() => removeFilter("color", color)}
          aria-label={`Remove ${colorLabels.get(color) || color} color filter`}
        >
          {colorLabels.get(color) || color} <span aria-hidden="true">×</span>
        </button>
      ))}
      {hasPriceFilter && (
        <button
          type="button"
          className={styles.filterTag}
          onClick={removePriceFilter}
          aria-label="Remove price filter"
        >
          {priceLabel} <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
}
