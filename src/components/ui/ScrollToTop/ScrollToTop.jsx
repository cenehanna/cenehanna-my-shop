"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./ScrollToTop.module.css";
import { ChevronUp } from "lucide-react";

export default function ScrollToTopBtn() {
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const lastScrollY = useRef(0);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Ініціалізуємо початкову позицію при монтуванні
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const previousScrollY = lastScrollY.current;
      const diff = currentScrollY - previousScrollY;

      // 1. Якщо ми вище 300px — кнопка завжди прихована
      if (currentScrollY <= 300) {
        setShowScrollBtn(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      // 2. Ігноруємо мікроколивання менше ніж 8px в будь-який бік
      const SCROLL_DELTA = 8;
      if (Math.abs(diff) < SCROLL_DELTA) {
        return;
      }

      // 3. Якщо різниця негативна і більше 8px — це чіткий скрол ВГОРУ
      const isScrollingUp = diff < 0;

      setShowScrollBtn(isScrollingUp);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      type="button"
      className={`${styles.btn} ${showScrollBtn ? styles.visible : styles.hidden}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      tabIndex={showScrollBtn ? 0 : -1}
    >
      <ChevronUp size={30} strokeWidth={1.5} />
    </button>
  );
}