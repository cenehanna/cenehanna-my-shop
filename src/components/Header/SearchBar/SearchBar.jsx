"use client";

import { Search, X, ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  // Автоматичний фокус на інпут при відкритті
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Логіка для обробки пошуку
      console.log("Пошуковий запит:", query);
    }
  };

  return (
    <div
      className={`${styles.searchWrapper} ${isOpen ? styles.open : ""}`}
      aria-hidden={!isOpen}
      onClick={onClose} /* Закриття при натисканні на затемнення */
    >
      {/* Контейнер поля пошуку */}
      <form 
        role="search"
        onSubmit={handleSubmit}
        className={styles.searchHeader} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка "Назад" відображається тільки на мобільних */}
        <button
          type="button"
          onClick={onClose}
          className={styles.backButton}
          aria-label="Go back"
          tabIndex={isOpen ? 0 : -1}
        >
          <ArrowLeft size={22} />
        </button>

        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} />

          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
            tabIndex={isOpen ? 0 : -1}
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className={styles.clearButton}
              aria-label="Clear"
              tabIndex={isOpen ? 0 : -1}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Кнопка "Знайти" */}
        <button
          type="submit"
          className={styles.submitButton}
          tabIndex={isOpen ? 0 : -1}
        >
          Search
        </button>
      </form>
    </div>
  );
}