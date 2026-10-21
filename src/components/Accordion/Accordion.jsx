"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import styles from "./Accordion.module.css";

export default function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={styles.accordion}>
      <button
        type="button"
        className={styles.trigger}
        onClick={toggleAccordion}
        aria-expanded={isOpen}
      >
        <span className={styles.title}>{title}</span>
        
        <ChevronRight
          size={18}
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          aria-hidden="true"
        />
      </button>

     {/* Контейнер-обгортка для CSS Grid анімації */}
      <div
        className={`${styles.contentWrapper} ${
          isOpen ? styles.contentOpen : ""
        }`}
      >
        <div className={styles.contentInner}>{children}</div>
      </div>
      
    </div>
  );
}