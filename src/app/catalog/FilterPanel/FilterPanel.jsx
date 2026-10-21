import styles from './FilterPanel.module.css';
import PriceFilter from '../PriceFilter/PriceFilter';
import ColorFilter from '../ColorFilter/ColorFilter';

export default function FilterPanel({ colors }) {
    return(
 <aside className={styles.filtersPanel}>
          <div className={styles.filtersPanelContent}>
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
    )
}
