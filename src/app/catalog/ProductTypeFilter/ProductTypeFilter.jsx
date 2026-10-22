"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ProductTypeFilter({
  productTypes,
  groupClassName,
  optionsClassName,
  optionClassName,
  idPrefix,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (productTypes.length === 0) return null;

  const selectedTypes = searchParams.getAll("productType");

  const updateProductType = (productType, checked) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    const nextTypes = new Set(selectedTypes);

    if (checked) nextTypes.add(productType);
    else nextTypes.delete(productType);

    nextParams.delete("productType");
    for (const selectedType of nextTypes) {
      nextParams.append("productType", selectedType);
    }
    nextParams.delete("page");

    const queryString = nextParams.toString();
    router.push(
      `${pathname || "/catalog"}${queryString ? `?${queryString}` : ""}`,
    );
  };

  return (
    <section className={groupClassName}>
      <h3>Product type</h3>
      <div className={optionsClassName}>
        {productTypes.map(({ value, label, count }, index) => {
          const id = `${idPrefix}-${index}`;

          return (
            <label key={value} className={optionClassName} htmlFor={id}>
              <input
                id={id}
                type="checkbox"
                checked={selectedTypes.includes(value)}
                onChange={(event) =>
                  updateProductType(value, event.target.checked)
                }
              />
              <span>
                {label} ({count})
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
