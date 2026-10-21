"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PriceFilter({
  blockClassName,
  inputsClassName,
  separatorClassName,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  useEffect(() => {
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchParams]);

  const applyPriceFilter = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    const min = minPrice.trim();
    const max = maxPrice.trim();

    if (min) nextParams.set("minPrice", min);
    else nextParams.delete("minPrice");

    if (max) nextParams.set("maxPrice", max);
    else nextParams.delete("maxPrice");

    nextParams.delete("page");
    const queryString = nextParams.toString();
    router.push(
      `${pathname || "/catalog"}${queryString ? `?${queryString}` : ""}`,
    );
  };

  return (
    <div className={blockClassName}>
      <h3>Price, ₴</h3>
      <div className={inputsClassName}>
        <input
          type="number"
          placeholder="From"
          min="0"
          aria-label="Minimum price"
          value={minPrice}
          onChange={(event) => setMinPrice(event.target.value)}
        />
        <span className={separatorClassName}>-</span>
        <input
          type="number"
          placeholder="To"
          min="0"
          aria-label="Maximum price"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          onBlur={applyPriceFilter}
        />
      </div>
    </div>
  );
}
