"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MobileBottomMenu.module.css";

export default function MobileBottomMenu() {
  const pathname = usePathname();

  const isHomeActive = pathname === "/";
  const isCatalogActive = pathname.startsWith("/catalog");
  const isFavoritesActive = pathname.startsWith("/favorites");
  const isProfileActive = pathname.startsWith("/profile");

  return (
    <nav className={styles.bottomMenu} aria-label="Mobile bottom navigation">
      <Link
        href="/"
        className={`${styles.action} ${isHomeActive ? styles.selected : ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2h-4v-7a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v7H5a2 2 0 0 1-2-2z" />
        </svg>
        <span className={styles.label}>Home</span>
      </Link>

      <Link
        href="/catalog"
        className={`${styles.action} ${isCatalogActive ? styles.selected : ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="3" width="7" height="7" rx="1" />
        </svg>
        <span className={styles.label}>Catalog</span>
      </Link>

      <Link
        href="/favorites"
        className={`${styles.action} ${isFavoritesActive ? styles.selected : ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
        </svg>
        <span className={styles.label}>Favorites</span>
      </Link>

      <Link
        href="/profile"
        className={`${styles.action} ${isProfileActive ? styles.selected : ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2h14zM12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        </svg>
        <span className={styles.label}>Profile</span>
      </Link>
    </nav>
  );
}
