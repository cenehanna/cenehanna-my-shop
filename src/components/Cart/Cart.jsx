"use client";

import { ShoppingBag, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "@/components/ui/ProductImage";
import { getFirstImage } from "@/lib/images";
import styles from "./Cart.module.css";

const CART_ITEMS_KEY = "cart-items";

export default function Cart({ isOpen, mode = "drawer", onClose }) {
  const cartRef = useRef(null);
  const [items, setItems] = useState([]);

  // Завантаження товарів
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const products = JSON.parse(
          localStorage.getItem(CART_ITEMS_KEY) || "[]",
        );
        setItems(products);
      } catch (error) {
        console.error("Не вдалося завантажити товари з кошика:", error);
        setItems([]);
      }
    };

    loadCartItems();
    window.addEventListener("storage", loadCartItems);
    window.addEventListener("cart-updated", loadCartItems);

    return () => {
      window.removeEventListener("storage", loadCartItems);
      window.removeEventListener("cart-updated", loadCartItems);
    };
  }, []);

  const handleRemoveItem = (id) => {
    try {
      const updatedItems = items.filter((item) => item.id !== id);
      setItems(updatedItems);
      localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(updatedItems));
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Помилка при видаленні товару:", error);
    }
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0,
  );

  // Escape — закриття
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Блокування скролу body

  // Кожен режим має власний, незалежний прапорець "відкритості".
  // Це критично: без цього обидва <aside> ділили б transform-стан.
  const isDrawerOpen = isOpen && mode === "drawer";
  const isModalOpen = isOpen && mode === "modal";

  // Спільний вміст (шапка / список / футер) — рендериться однаково
  // всередині обох варіантів, щоб не дублювати JSX вручну.
  const renderContent = () => (
    <>
      <div className={styles.cartHeader}>
        <h2>Cart ({items.length})</h2>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close cart"
          tabIndex={isOpen ? 0 : -1}
        >
          <X size={22} />
        </button>
      </div>

      {items.length === 0 ? (
        <div className={styles.emptyCart}>
          <ShoppingBag size={42} strokeWidth={1.5} />
          <p>Your cart is empty</p>
          <span>Add items you like to get started</span>
        </div>
      ) : (
        <div className={styles.cartItems}>
          {items.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.itemImageWrapper}>
                <Image
                  src={getFirstImage(
                    item.images?.length ? item.images : item.image,
                  )}
                  width={80}
                  height={80}
                  alt={item.title}
                  className={styles.itemImage}
                />
              </div>

              <div className={styles.itemInfo}>
                <h4 className={styles.itemTitle}>{item.title}</h4>
                <span className={styles.itemPrice}>{item.price} UAH</span>
              </div>

              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemoveItem(item.id)}
                aria-label={`Remove ${item.title}`}
                title="Remove"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.cartFooter}>
        <div className={styles.totalRow}>
          <span>Total</span>
          <strong>{totalPrice.toLocaleString("uk-UA")} UAH</strong>
        </div>
        <Link
          href="/checkout"
          className={`${styles.checkoutButton} ${
            items.length === 0 ? styles.checkoutDisabled : ""
          }`}
          aria-disabled={items.length === 0}
          tabIndex={items.length === 0 ? -1 : 0}
          onClick={items.length === 0 ? (e) => e.preventDefault() : onClose}
        >
          Proceed to Checkout
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Оверлей рендериться ТІЛЬКИ коли кошик відкритий (в будь-якому режимі) */}
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      )}

      {/* Drawer-варіант — власний DOM-вузол, ніколи не перевикористовується modal-ом */}
      <aside
        ref={mode === "drawer" ? cartRef : null}
        className={`${styles.cartContainer} ${styles.cartDrawer} ${
          isDrawerOpen ? styles.cartOpen : ""
        }`}
        aria-label="Cart"
        aria-hidden={!isDrawerOpen}
        role="dialog"
        aria-modal="true"
      >
        {renderContent()}
      </aside>

      {/* Modal-варіант — власний DOM-вузол, ніколи не перевикористовується drawer-ом */}
      <aside
        ref={mode === "modal" ? cartRef : null}
        className={`${styles.cartContainer} ${styles.cartModal} ${
          isModalOpen ? styles.cartOpen : ""
        }`}
        aria-label="Cart"
        aria-hidden={!isModalOpen}
        role="dialog"
        aria-modal="true"
      >
        {renderContent()}
      </aside>
    </>
  );
}
