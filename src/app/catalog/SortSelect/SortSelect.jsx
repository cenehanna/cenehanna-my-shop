"use client";

import { Check, ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./SortSelect.module.css";

const SORT_OPTIONS = [
  { value: "newest", label: "Newly added" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentSort = searchParams.get("sort") || "newest";
  const selectedOption =
    SORT_OPTIONS.find((opt) => opt.value === currentSort) || SORT_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("sort", value);
    nextParams.delete("page");

    router.push(`${pathname || "/catalog"}?${nextParams.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className={styles.sortWrapper}>
      <span className={styles.sortLabel}>Sort by:</span>

      <div className={styles.customSelectContainer} ref={dropdownRef}>
        <button
          type="button"
          className={`${styles.customSelectTrigger} ${isOpen ? styles.open : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedOption.label}</span>
          <ChevronDown
            size={16}
            className={`${styles.chevron} ${isOpen ? styles.chevronRotated : ""}`}
          />
        </button>

        {isOpen && (
          <ul className={styles.customDropdown}>
            {SORT_OPTIONS.map((option) => {
              const isSelected = option.value === currentSort;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    className={`${styles.dropdownItem} ${isSelected ? styles.selectedItem : ""}`}
                    onClick={() => handleSelect(option.value)}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check size={14} />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
