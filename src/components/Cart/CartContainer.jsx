"use client";

import Cart from "./Cart";
import { useCartUI } from "@/lib/CartUIContext";

export default function CartContainer() {
  const { isOpen, mode, closeCart } = useCartUI();
  return <Cart isOpen={isOpen} mode={mode} onClose={closeCart} />;
}
