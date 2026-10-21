"use client";

import SearchableDropdown from "./SearchableDropdown";
import styles from "./CheckoutPage.module.css";

// --- Маленький FormField (використовується всередині) ---
export function FormField({
  label, name, value, onChange, onBlur,
  placeholder, type = "text", error, maxLength,
}) {
  return (
    <div className={styles.inputWrapper}>
      <label className={styles.inputLabel}>{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        maxLength={maxLength}
        className={`${styles.textInput} ${error ? styles.inputError : ""}`}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}

// --- Поля Укрпошти ---
function UkrposhtaFields({ ukrData, onChange, onBlur, errors, touched }) {
  const showError = (f) => touched[f] && errors[f];
  return (
    <div className={styles.formGrid}>
      <FormField
        label="Postal Code" name="postIndex" placeholder="36000" maxLength={5}
        value={ukrData.postIndex} onChange={onChange} onBlur={onBlur}
        error={showError("ukrIndex")}
      />
      <FormField
        label="Region / State" name="region" placeholder="Poltava Region"
        value={ukrData.region} onChange={onChange} onBlur={onBlur}
        error={showError("ukrRegion")}
      />
      <FormField
        label="City / Settlement" name="city" placeholder="Poltava"
        value={ukrData.city} onChange={onChange} onBlur={onBlur}
        error={showError("ukrCity")}
      />
      <FormField
        label="Street" name="street" placeholder="Sobornosti St."
        value={ukrData.street} onChange={onChange} onBlur={onBlur}
        error={showError("ukrStreet")}
      />
      <FormField
        label="Building / House" name="house" placeholder="12/A"
        value={ukrData.house} onChange={onChange} onBlur={onBlur}
        error={showError("ukrHouse")}
      />
      <FormField
        label="Apartment (optional)" name="apartment" placeholder="45"
        value={ukrData.apartment} onChange={onChange}
      />
    </div>
  );
}

// --- Поля Нової Пошти ---
function NovaPoshtaFields({ np, errors, touched }) {
  const showError = (f) => touched[f] && errors[f];
  return (
    <div className={styles.formGroup}>
      <SearchableDropdown
        label="City"
        placeholder="Enter city (e.g. Kyiv)"
        query={np.cityQuery}
        onQueryChange={np.setCityQuery}
        items={np.cities}
        selected={np.selectedCity}
        onSelect={np.selectCity}
        onClear={np.clearCity}
        getKey={(c) => c.Ref}
        getMain={(c) => c.Present}
        getSub={(c) => c.Area}
        isLoading={np.isCityLoading}
        error={showError("npCity")}
      />
      <SearchableDropdown
        label="Branch or Parcel Locker"
        placeholder="Enter branch number or address"
        disabledPlaceholder="Please select a city first"
        query={np.branchQuery}
        onQueryChange={np.setBranchQuery}
        items={np.branches}
        selected={np.selectedBranch}
        onSelect={np.selectBranch}
        onClear={np.clearBranch}
        getKey={(b) => b.Ref}
        getMain={(b) => b.Description}
        getSub={(b) => b.ShortAddress}
        isLoading={np.isBranchLoading}
        disabled={!np.selectedCity}
        error={showError("npBranch")}
        minChars={0}
      />
    </div>
  );
}

// --- Головний компонент секції "Доставка" ---
export default function CheckoutForm({
  carrier, onCarrierChange,
  np, ukrData, onUkrChange, onBlur,
  errors, touched,
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Delivery</h2>

      <div className={styles.carrierOptions}>
        <label className={styles.radioLabel}>
          <input
            type="radio" name="carrier" value="nova"
            checked={carrier === "nova"}
            onChange={() => onCarrierChange("nova")}
            className={styles.radioInput}
          />
          Nova Poshta
        </label>
        <label className={styles.radioLabel}>
          <input
            type="radio" name="carrier" value="ukr"
            checked={carrier === "ukr"}
            onChange={() => onCarrierChange("ukr")}
            className={styles.radioInput}
          />
          Ukrposhta
        </label>
      </div>

      {carrier === "nova" ? (
        <NovaPoshtaFields np={np} errors={errors} touched={touched} />
      ) : (
        <UkrposhtaFields
          ukrData={ukrData}
          onChange={onUkrChange}
          onBlur={onBlur}
          errors={errors}
          touched={touched}
        />
      )}
    </section>
  );
}