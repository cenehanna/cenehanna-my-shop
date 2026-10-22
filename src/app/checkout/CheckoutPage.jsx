"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui";
import Image from "@/components/ui/ProductImage";
import CheckoutForm, { FormField } from "./CheckoutForm";
import styles from "./CheckoutPage.module.css";
import { useCartItems, useCheckoutForm } from "./checkoutUtils";

export default function CheckoutPage() {
  const { items: cartItems, subtotal } = useCartItems();

  const {
    formData,
    handleInputChange,
    handleBlur,
    ukrData,
    handleUkrChange,
    carrier,
    handleCarrierChange,
    paymentMethod,
    setPaymentMethod,
    errors,
    hasErrors,
    touched,
    touchAll,
    isSubmitting,
    np,
    submit,
  } = useCheckoutForm(cartItems);

  const showError = (f) => touched[f] && errors[f];
  const hasVisibleErrors = Object.entries(errors).some(
    ([field, error]) => touched[field] && error,
  );
  const isEmpty = cartItems.length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEmpty) return;
    touchAll();
    if (hasErrors) return;
    const data = await submit(subtotal);
    if (data.success) alert("Order successfully placed!");
    else alert(`Error: ${data.error}`);
  };

  return (
    <div className={styles.checkoutContainer}>
      <form onSubmit={handleSubmit} className={styles.layout} noValidate>
        <div className={styles.mainContent}>
          <h1 className={styles.title}>Checkout</h1>

          {/* Список товарів */}
          {isEmpty ? (
            <div className={styles.emptyCart}>
              <ShoppingBag size={48} strokeWidth={1.5} />
              <p>Your cart is empty</p>
              <Link href="/" className={styles.emptyCartLink}>
                Return to shopping
              </Link>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.itemCard}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={120}
                    height={160}
                    className={styles.itemImage}
                  />
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <p className={styles.itemMeta}>
                      Size: <span>{item.size}</span>
                    </p>
                    <p className={styles.itemMeta}>
                      Brand: <span>{item.brand}</span>
                    </p>
                  </div>
                  <div className={styles.itemPriceBlock}>
                    <span className={styles.priceLabel}>Price:</span>
                    <span className={styles.priceValue}>
                      {item.price.toLocaleString("uk-UA")} UAH
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Контактні дані, Доставка, Оплата — тільки якщо кошик не порожній */}
          {!isEmpty && (
            <>
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Contact Details</h2>
                <div className={styles.formGrid}>
                  <FormField
                    label="Last Name"
                    name="lastName"
                    placeholder="Shevchenko"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={showError("lastName")}
                  />
                  <FormField
                    label="First Name"
                    name="firstName"
                    placeholder="Olena"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={showError("firstName")}
                  />
                  <FormField
                    label="Middle Name"
                    name="middleName"
                    placeholder="Ivanivna"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={showError("middleName")}
                  />
                  <FormField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    placeholder="+380671234567"
                    maxLength={13}
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={showError("phone")}
                  />
                </div>
              </section>

              <CheckoutForm
                carrier={carrier}
                onCarrierChange={handleCarrierChange}
                np={np}
                ukrData={ukrData}
                onUkrChange={handleUkrChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Payment</h2>
                <div className={styles.formGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                      className={styles.radioInput}
                    />
                    Online
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className={styles.radioInput}
                    />
                    Cash on Delivery
                  </label>
                </div>
              </section>
            </>
          )}
        </div>

        {/* Саммарі */}
        <aside className={styles.summaryCard}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>{cartItems.length} items totaling</span>
            <span>{subtotal.toLocaleString("uk-UA")} UAH</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping cost</span>
            <span>carrier rates apply</span>
          </div>
          <div className={styles.summaryDivider} />
          <div className={styles.totalRow}>
            <span>Total to pay</span>
            <span>{subtotal.toLocaleString("uk-UA")} UAH</span>
          </div>
          <Button
            type="submit"
            variant="solid"
            shape="rounded"
            disabled={isSubmitting || hasErrors || isEmpty}
            className={styles.submitButton}
          >
            {isSubmitting ? "Submitting..." : "Place Order"}
          </Button>
          {hasVisibleErrors && !isEmpty && (
            <p
              className={styles.errorText}
              style={{ marginTop: 12, textAlign: "center" }}
            >
              Please fill in all fields correctly
            </p>
          )}
        </aside>
      </form>
    </div>
  );
}
