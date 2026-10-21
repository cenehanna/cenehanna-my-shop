"use client";

import {
  ChevronDown,
  ChevronRight,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCartUI } from "@/lib/CartUIContext";
import styles from "./Header.module.css";
import MobileBottomMenu from "./MobileBottomMenu/MobileBottomMenu";
import MobileDrawerMenu from "./MobileDrawerMenu/MobileDrawerMenu";
import SearchBar from "./SearchBar/SearchBar";

const CART_ITEMS_KEY = "cart-items";

export default function Header({ CATEGORIES }) {
  const pathname = usePathname();
  const { openCart } = useCartUI();

  // Стани меню
  const [isOpen, setIsOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Кошик — лише лічильник
  const [cartCount, setCartCount] = useState(0);

  // Стан для контролю активних випадаючих пунктів каталогу
  const [activeCatId, setActiveCatId] = useState(null);

  const timeoutRef = useRef(null);
  const activeCategory = CATEGORIES.find(
    (category) => category.id === activeCatId,
  );
  const childColumnCount = Math.min(
    3,
    activeCategory?.children?.length ?? 0,
  );
  const childColumns = Array.from({ length: childColumnCount }, () => []);
  activeCategory?.children?.forEach((child, index) => {
    childColumns[index % childColumnCount].push(child);
  });

  // --- Лічильник товарів у кошику ---
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const items = JSON.parse(localStorage.getItem(CART_ITEMS_KEY) || "[]");
        setCartCount(items.length);
      } catch (error) {
        console.error("Помилка зчитування кошика в хедері:", error);
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener("cart-updated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cart-updated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  // --- Скидання скролу при переході на головну ---
  useEffect(() => {
    if (pathname !== "/") return;

    const resetScroll = window.requestAnimationFrame(() => {
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    });

    return () => window.cancelAnimationFrame(resetScroll);
  }, [pathname]);

  // --- Закриття мобільного меню ---
  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setExpandedCategory(null);
  }, []);

  // --- Закриття каталогу ---
  const closeCatalog = useCallback(() => {
    setIsCatalogOpen(false);
    setActiveCatId(null);
  }, []);

  // --- Каталог: hover ---
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveCatId((current) =>
      CATEGORIES.some((category) => category.id === current)
        ? current
        : (CATEGORIES[0]?.id ?? null),
    );
    setIsCatalogOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      closeCatalog();
    }, 200);
  };

  // --- Мобільне меню: розгортання категорій ---
  const toggleCategory = (id) => {
    setExpandedCategory((prev) => (prev === id ? null : id));
  };

  // --- Відкриття кошика в режимі drawer ---
  const handleOpenCart = () => {
    openCart("drawer");
  };

  return (
    <>
      <MobileDrawerMenu
        isOpen={isOpen}
        closeMenu={closeMenu}
        expandedCategory={expandedCategory}
        toggleCategory={toggleCategory}
        CATEGORIES={CATEGORIES}
        cartCount={cartCount}
        onOpenSearch={() => {
          closeMenu();
          setIsSearchOpen(true);
        }}
      />

      <header className={styles.header}>
        <nav className={styles.navContainer} aria-label="Main navigation">
          {/* Ліва секція */}
          <div className={styles.leftSection}>
            <button
              type="button"
              className={`${styles.menuBtn} ${styles.navigationButton}`}
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} className={styles.mobileMenuIcon} />
            </button>

            <div
              className={`${styles.dropdown} ${
                isCatalogOpen ? styles.dropdownOpen : ""
              }`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={styles.dropBtn}
                onClick={() => {
                  if (isCatalogOpen) {
                    closeCatalog();
                  } else {
                    handleMouseEnter();
                  }
                }}
                onFocus={handleMouseEnter}
              >
                Catalog <ChevronDown className={styles.iconArrow} />
              </button>

              <div
                className={styles.dropdownContent}
                style={{
                  gridTemplateColumns: activeCategory?.children?.length
                    ? `minmax(200px, 1.2fr) repeat(${childColumnCount}, minmax(0, 1fr))`
                    : "minmax(200px, 1fr)",
                }}
              >
                <ul className={styles.categoryColumn} aria-label="Categories">
                  {CATEGORIES.map((category) => (
                    <li
                      key={category.id}
                      className={
                        activeCatId === category.id ? styles.activeLi : ""
                      }
                      onMouseEnter={() => setActiveCatId(category.id)}
                    >
                      <Link
                        href={`/catalog/${category.slug}`}
                        onClick={closeCatalog}
                      >
                        <span>{category.name}</span>
                        {category.children?.length > 0 && (
                          <ChevronRight className={styles.regularArrows} />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>

                {childColumns.map((column, columnIndex) => (
                  <div
                    key={`${activeCategory?.id}-column-${columnIndex}`}
                    className={styles.categoryColumn}
                    aria-label={`${activeCategory?.name} subcategories column ${columnIndex + 1}`}
                  >
                    {column.map((child) => (
                      <section
                        key={child.id}
                        className={styles.categoryBranch}
                      >
                        <Link
                          href={`/catalog/${activeCategory.slug}/${child.slug}`}
                          onClick={closeCatalog}
                        >
                          {child.name}
                        </Link>
                        {child.children?.length > 0 && (
                          <ul>
                            {child.children.map((nested) => (
                              <li key={nested.id}>
                                <Link
                                  href={`/catalog/${activeCategory.slug}/${child.slug}/${nested.slug}`}
                                  onClick={closeCatalog}
                                >
                                  {nested.name}
                                  {nested._count?.products !== undefined &&
                                    ` (${nested._count.products})`}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </section>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <Link href="/#faq" className={styles.navLink}>
              FAQ &amp; Shipping
            </Link>
          </div>

          {/* Логотип по центру */}
          <Link href="/" className={styles.logo}>
            @cenehanna
          </Link>

          {/* Іконки дій */}
          <div className={styles.navigationIcons}>
            <button
              className={styles.navigationButton}
              type="button"
              aria-label="Search"
              onClick={() => setIsSearchOpen((prev) => !prev)}
            >
              <Search size={20} />
            </button>

            <Link
              href="/favorites"
              className={`${styles.likeIcon} ${styles.navigationButton}`}
              aria-label="Favorites"
            >
              <Heart size={20} />
            </Link>

            <button
              className={`${styles.cartIcon} ${styles.navigationButton}`}
              type="button"
              aria-label="Cart"
              onClick={handleOpenCart}
            >
              <ShoppingCart size={20} />{" "}
              <span className={styles.cartCount}>{cartCount}</span>
            </button>

            <Link
              href="/profile"
              className={`${styles.userIcon} ${styles.navigationButton}`}
              aria-label="Profile"
            >
              <User size={20} />
            </Link>
          </div>

          <MobileBottomMenu />
        </nav>
      </header>

      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
