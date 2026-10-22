import ColorFilter from "../ColorFilter/ColorFilter";
import PriceFilter from "../PriceFilter/PriceFilter";
import ProductTypeFilter from "../ProductTypeFilter/ProductTypeFilter";
import styles from "./FilterPanel.module.css";

export default function FilterPanel({ colors, productTypes }) {
  return (
    <aside className={styles.filtersPanel}>
      <div className={styles.filtersPanelContent}>
        <ProductTypeFilter
          productTypes={productTypes}
          groupClassName={styles.filterBlock}
          optionsClassName={styles.colorOptions}
          optionClassName={styles.filterOption}
          idPrefix="desktop-product-type"
        />
        <ColorFilter
          colors={colors}
          groupClassName={styles.filterBlock}
          optionsClassName={styles.colorOptions}
          optionClassName={styles.filterOption}
          idPrefix="desktop-color"
        />
        <PriceFilter
          blockClassName={styles.filterBlock}
          inputsClassName={styles.priceInputs}
          separatorClassName={styles.priceSeparator}
        />
      </div>
    </aside>
  );
}
