"use client";

import { Check } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ColorFilter({
  colors,
  groupClassName,
  optionsClassName,
  optionClassName,
  checkboxClassName,
  idPrefix,
  showCheckmark = false,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (colors.length === 0) return null;

  const selectedColors = searchParams.getAll("color");

  const updateColor = (color, checked) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    const nextColors = new Set(selectedColors);

    if (checked) nextColors.add(color);
    else nextColors.delete(color);

    nextParams.delete("color");
    for (const selectedColor of nextColors) {
      nextParams.append("color", selectedColor);
    }
    nextParams.delete("page");

    const queryString = nextParams.toString();
    router.push(
      `${pathname || "/catalog"}${queryString ? `?${queryString}` : ""}`,
    );
  };

  return (
    <section className={groupClassName}>
      <h3>Color</h3>
      <div className={optionsClassName}>
        {colors.map(({ value, label, count }, index) => {
          const id = `${idPrefix}-${index}`;
          return (
            <label key={value} className={optionClassName} htmlFor={id}>
              <input
                id={id}
                type="checkbox"
                checked={selectedColors.includes(value)}
                onChange={(event) => updateColor(value, event.target.checked)}
              />
              {showCheckmark && (
                <span className={checkboxClassName}>
                  <Check size={13} strokeWidth={3} />
                </span>
              )}
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
