"use client";

import { useRef, useState } from "react";
import { Search, X } from "lucide-react";
import styles from "./CheckoutPage.module.css";
import { useClickOutside, highlightMatch } from "./checkoutUtils";

export default function SearchableDropdown({
  label,
  placeholder,
  disabledPlaceholder,
  query,
  onQueryChange,
  items,
  selected,
  onSelect,
  onClear,
  getKey,
  getMain,
  getSub,
  isLoading,
  disabled,
  error,
  minChars = 2,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useClickOutside(ref, () => setIsOpen(false));

  const tooShort = !selected && query.trim().length < minChars;
  const showList = isOpen && !disabled;

  return (
    <div className={styles.inputWrapper} ref={ref}>
      <label className={styles.inputLabel}>{label}</label>
      <div className={styles.dropdownContainer}>
        <div className={styles.searchInputWrapper}>
          <Search size={18} className={styles.searchIconLeft} />
          <input
            type="text"
            placeholder={disabled ? disabledPlaceholder : placeholder}
            value={query}
            disabled={disabled}
            onChange={(e) => {
              onQueryChange(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => !disabled && setIsOpen(true)}
            className={`${styles.textInput} ${styles.textInputWithIcon} ${
              error ? styles.inputError : ""
            }`}
            autoComplete="off"
          />
          {selected ? (
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => {
                onClear();
                setIsOpen(true);
              }}
              aria-label="Clear"
            >
              <X size={16} />
            </button>
          ) : (
            isLoading && <span className={styles.loadingSpinner} />
          )}
        </div>

        {showList && (
          <ul className={styles.dropdownList}>
            {isLoading && items.length === 0 && (
              <li className={styles.dropdownEmpty}>Loading...</li>
            )}
            {!isLoading && tooShort && (
              <li className={styles.dropdownEmpty}>
                Enter at least {minChars} characters
              </li>
            )}
            {!isLoading && !tooShort && items.length === 0 && (
              <li className={styles.dropdownEmpty}>Nothing found</li>
            )}
            {items.map((item) => (
              <li
                key={getKey(item)}
                className={styles.dropdownItem}
                onClick={() => {
                  onSelect(item);
                  setIsOpen(false);
                }}
              >
                <span className={styles.dropdownItemMain}>
                  {highlightMatch(getMain(item), query, styles.highlight)}
                </span>
                {getSub?.(item) && (
                  <span className={styles.dropdownItemSub}>{getSub(item)}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
