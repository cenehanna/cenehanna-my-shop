"use client";

import { Check, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "@/components/ui";
import { useCartUI } from "@/lib/CartUIContext";
import { useFavorite } from "@/lib/useFavorite";
import styles from "../product.module.css";

const CART_ITEMS_KEY = "cart-items";
const MAX_CART_ITEMS = 40;

export default function Buttons({ product }) {
  const [isInCart, setIsInCart] = useState(false);
  const { openCart } = useCartUI();
  const { isFavorite, toggleFavorite } = useFavorite(product.id);

  useEffect(() => {
    const checkCartStatus = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(CART_ITEMS_KEY) || "[]");
        setIsInCart(saved.some((item) => item.id === product.id));
      } catch (error) {
        console.error("Помилка перевірки стану кошика:", error);
      }
    };

    checkCartStatus();
    window.addEventListener("cart-updated", checkCartStatus);
    window.addEventListener("storage", checkCartStatus);

    return () => {
      window.removeEventListener("cart-updated", checkCartStatus);
      window.removeEventListener("storage", checkCartStatus);
    };
  }, [product.id]);

  const handleAddToCart = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_ITEMS_KEY) || "[]");
      const filtered = saved.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, MAX_CART_ITEMS);

      localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("cart-updated"));

      openCart("modal"); // ← тільки один виклик, з режимом
    } catch (error) {
      console.error("Не вдалося додати товар у кошик:", error);
    }
  };

  return (
    <div className={styles.buttonContainer}>
      <Button
        type="button"
        variant="solid"
        shape="rounded"
        className={isInCart ? styles.inCartButton : ""}
        onClick={handleAddToCart}
        disabled={isInCart}
      >
        {isInCart ? (
          <>
            In Cart <Check className={styles.CheckIcon} size={18} />
          </>
        ) : (
          "Add to Cart"
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        shape="pill"
        className={styles.favorite}
        onClick={toggleFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          fill={isFavorite ? "#D98FA7" : "none"}
          stroke={isFavorite ? "#D98FA7" : "currentColor"}
        />
      </Button>
    </div>
  );
}
