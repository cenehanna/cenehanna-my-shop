"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Heart,
  User,
  X,
  Grid2X2,
  Truck,
  MoveRight,
  ShoppingCart,
  Search,
} from "lucide-react";
import { useCartUI } from "@/lib/CartUIContext";
import {
  readFavoriteIds,
  FAVORITES_UPDATED_EVENT,
} from "@/lib/favoritesStorage";
import styles from "./MobileDrawerMenu.module.css";

export default function MobileDrawerMenu({
  isOpen,
  closeMenu,
  expandedCategory,
  CATEGORIES = [],
  toggleCategory,
  cartCount = 0,
  onOpenSearch,
}) {
  const pathname = usePathname();
  const { openCart } = useCartUI();

  // Вкладений стан для підкатегорій (рівень 2)
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Слідкуємо за кількістю збережених товарів
  useEffect(() => {
    const updateFavorites = () => {
      setFavoritesCount(readFavoriteIds().length);
    };
    updateFavorites();
    window.addEventListener(FAVORITES_UPDATED_EVENT, updateFavorites);
    window.addEventListener("storage", updateFavorites);
    return () => {
      window.removeEventListener(FAVORITES_UPDATED_EVENT, updateFavorites);
      window.removeEventListener("storage", updateFavorites);
    };
  }, []);

  // Автоматичне закриття меню при зміні маршруту
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  // Блокування скролу body при відкритому меню
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setExpandedSubCategory(null);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Закриття по Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeMenu]);

  const toggleSubCategory = (subId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setExpandedSubCategory((prev) => (prev === subId ? null : subId));
  };

  const handleOpenCart = () => {
    closeMenu();
    openCart("drawer");
  };

  return (
    <>
      {/* Затемнення фону (Backdrop) */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropActive : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Меню Drawer */}
      <aside
        className={`${styles.mobileMenu} ${isOpen ? styles.active : ""}`}
        aria-hidden={!isOpen}
        aria-label="Mobile menu"
      >
        <div className={styles.mobileHeader}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            @cenehanna
          </Link>

          <div className={styles.headerControls}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <X size={22} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className={styles.mobileContent}>
          {/* Швидкий пошук */}
          {onOpenSearch && (
            <button
              type="button"
              className={styles.searchTrigger}
              onClick={onOpenSearch}
            >
              <Search size={18} className={styles.searchIcon} />
              <span>Search products...</span>
            </button>
          )}

          {/* Швидкі посилання */}
          <div className={styles.quickLinks}>
            <Link
              href="/catalog"
              onClick={closeMenu}
              className={styles.quickLink}
            >
              <span className={styles.quickLinkIcon}>
                <Grid2X2 size={19} />
              </span>

              <span>
                <strong>All Products</strong>
                <small>Browse entire collection</small>
              </span>

              <MoveRight size={20} className={styles.arrowIcon} />
            </Link>

            <Link href="/#faq" onClick={closeMenu} className={styles.quickLink}>
              <span className={styles.quickLinkIcon}>
                <Truck size={19} />
              </span>

              <span>
                <strong>FAQ &amp; Shipping</strong>
                <small>Payment, delivery and FAQs</small>
              </span>

              <MoveRight size={20} className={styles.arrowIcon} />
            </Link>
          </div>

          {/* Категорії */}
          <section className={styles.categories}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Categories</span>
              <span className={styles.sectionCount}>{CATEGORIES.length}</span>
            </div>

            <div className={styles.categoryList}>
              {CATEGORIES.map((cat) => {
                const isExpanded = expandedCategory === cat.id;
                const hasChildren = cat.children && cat.children.length > 0;

                return (
                  <div
                    key={cat.id}
                    className={`${styles.accordionItem} ${
                      isExpanded ? styles.expanded : ""
                    }`}
                  >
                    <button
                      type="button"
                      className={styles.accordionTrigger}
                      onClick={() => toggleCategory(cat.id)}
                      aria-expanded={isExpanded}
                    >
                      <span>{cat.name}</span>

                      {hasChildren && (
                        <span className={styles.chevron}>
                          <ChevronDown size={19} />
                        </span>
                      )}
                    </button>

                    {isExpanded && hasChildren && (
                      <ul className={styles.subList}>
                        <li className={styles.allProductsItem}>
                          <Link
                            href={`/catalog/${cat.slug}`}
                            onClick={closeMenu}
                          >
                            <span>All {cat.name}</span>
                            <span>→</span>
                          </Link>
                        </li>

                        {cat.children.map((sub) => {
                          const hasSubChildren =
                            sub.children && sub.children.length > 0;
                          const isSubExpanded = expandedSubCategory === sub.id;

                          return (
                            <li key={sub.id} className={styles.subCategoryItem}>
                              <div
                                className={`${styles.subCategoryHeader} ${
                                  hasSubChildren
                                    ? styles.subCategoryHeaderToggle
                                    : ""
                                }`}
                                onClick={
                                  hasSubChildren
                                    ? (e) => toggleSubCategory(sub.id, e)
                                    : undefined
                                }
                              >
                                {hasSubChildren ? (
                                  // Підкатегорія з дітьми: НЕ переходить на сторінку,
                                  // тільки розгортає/згортає список нижче.
                                  <button
                                    type="button"
                                    className={styles.subCategoryLink}
                                    aria-expanded={isSubExpanded}
                                  >
                                    <span>{sub.name}</span>
                                  </button>
                                ) : (
                                  // Підкатегорія без дітей: звичайне посилання
                                  <Link
                                    href={`/catalog/${cat.slug}/${sub.slug}`}
                                    onClick={closeMenu}
                                    className={styles.subCategoryLink}
                                  >
                                    <span>{sub.name}</span>
                                    <span>→</span>
                                  </Link>
                                )}

                                {hasSubChildren && (
                                  <span
                                    className={`${styles.subChevron} ${
                                      isSubExpanded
                                        ? styles.subChevronExpanded
                                        : ""
                                    }`}
                                    aria-hidden="true"
                                  >
                                    <ChevronDown size={17} />
                                  </span>
                                )}
                              </div>

                              {hasSubChildren && isSubExpanded && (
                                <ul className={styles.nestedSubList}>
                                  <li className={styles.allProductsItem}>
                                    <Link
                                      href={`/catalog/${cat.slug}/${sub.slug}`}
                                      onClick={closeMenu}
                                    >
                                      <span>All {sub.name}</span>
                                      <span>→</span>
                                    </Link>
                                  </li>
                                  {sub.children.map((nested) => (
                                    <li key={nested.id}>
                                      <Link
                                        href={`/catalog/${cat.slug}/${sub.slug}/${nested.slug}`}
                                        onClick={closeMenu}
                                      >
                                        <span>
                                          {nested.name}
                                          {nested._count?.products !==
                                            undefined &&
                                            ` (${nested._count.products})`}
                                        </span>
                                        <span>→</span>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Нижні швидкі дії */}
        <div className={styles.mobileFooterActions}>
          <Link
            href="/favorites"
            onClick={closeMenu}
            className={styles.actionBtn}
          >
            <span className={styles.actionIconWrapper}>
              <Heart size={20} />
              {favoritesCount > 0 && (
                <span className={styles.actionBadge}>{favoritesCount}</span>
              )}
            </span>
            <span>Favorites</span>
          </Link>

          <button
            type="button"
            onClick={handleOpenCart}
            className={`${styles.actionBtn} ${styles.cartBtn}`}
          >
            <span className={styles.actionIconWrapper}>
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className={styles.cartBadge}>{cartCount}</span>
              )}
            </span>
            <span>Cart</span>
          </button>

          <Link
            href="/profile"
            onClick={closeMenu}
            className={styles.actionBtn}
          >
            <User size={20} />
            <span>Profile</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
