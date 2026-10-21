"use client";

import { createContext, useContext, useState, useCallback } from "react";

const CartUIContext = createContext(null);

export function CartUIProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("drawer"); // "drawer" | "modal"

  const openCart = useCallback((nextMode = "drawer") => {
    setMode(nextMode);
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setIsOpen((v) => {
      if (!v) setMode("drawer");
      return !v;
    });
  }, []);

  return (
    <CartUIContext.Provider
      value={{ isOpen, mode, openCart, closeCart, toggleCart }}
    >
      {children}
    </CartUIContext.Provider>
  );
}

export function useCartUI() {
  const ctx = useContext(CartUIContext);
  if (!ctx) {
    throw new Error("useCartUI must be used within CartUIProvider");
  }
  return ctx;
}
