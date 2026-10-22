'use client';

import { ChevronDown, Funnel, X } from 'lucide-react';
import { useState } from 'react';
import ColorFilter from '../ColorFilter/ColorFilter';
import PriceFilter from '../PriceFilter/PriceFilter';
import ProductTypeFilter from '../ProductTypeFilter/ProductTypeFilter';
import styles from './MobileFilterMenu.module.css';

function CategoryFilter({ categories }) {
	const [expandedCategory, setExpandedCategory] = useState(null);

	return (
		<section className={styles.categories}>
			<div className={styles.sectionHeader}>
				<span className={styles.sectionTitle}>Categories</span>
			</div>
			<p className={styles.categoryPlaceholder}>Select a category to filter</p>

			<div className={styles.categoryList}>
				{categories.map((category) => {
					const isExpanded = expandedCategory === category.id;

					return (
						<div
							key={category.id}
							className={`${styles.accordionItem} ${isExpanded ? styles.expanded : ''}`}
						>
							<button
								type="button"
								className={styles.accordionTrigger}
								onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
								aria-expanded={isExpanded}
							>
								<span>{category.name}</span>
								<span className={styles.chevron}>
									<ChevronDown size={19} />
								</span>
							</button>

							{isExpanded && category.children?.length > 0 && (
								<ul className={styles.subList}>
									{category.children.map((subcategory) => (
										<li key={subcategory.id}>
											<button type="button" className={styles.categoryOption}>
												<span>{subcategory.name}</span>
												<span>→</span>
											</button>
										</li>
									))}
								</ul>
							)}
						</div>
					);
				})}
			</div>
		</section>
	);
}

export default function MobileFilterMenu({
	categories = [],
	colors = [],
	productTypes = [],
}) {
	const [isOpen, setIsOpen] = useState(false);

	const closeMenu = () => setIsOpen(false);

	return (
		<>
			<button
				type="button"
				className={styles.openButton}
				onClick={() => setIsOpen(true)}
				aria-label="Open filters"
			>
				<span>Filters</span>
				<Funnel size={18} strokeWidth={1.5} />
			</button>

			<div className={`${styles.overlay} ${isOpen ? styles.active : ''}`} aria-hidden={!isOpen}>
				<div className={styles.drawer} role="dialog" aria-modal="true" aria-label="Filters">
					<div className={styles.header}>
						<div>
							<h2>Filters</h2>
						</div>
						<button type="button" className={styles.closeButton} onClick={closeMenu} aria-label="Close filters">
							<X size={22} strokeWidth={2} />
						</button>
					</div>

					<div className={styles.content}>
						{categories.length > 0 && <CategoryFilter categories={categories} />}
						<ProductTypeFilter
							productTypes={productTypes}
							groupClassName={styles.filterGroup}
							optionsClassName={styles.options}
							optionClassName={styles.option}
							idPrefix="mobile-product-type"
						/>
						<ColorFilter
							colors={colors}
							groupClassName={styles.filterGroup}
							optionsClassName={styles.options}
							optionClassName={styles.option}
							checkboxClassName={styles.checkbox}
							idPrefix="mobile-color"
							showCheckmark
						/>
						<PriceFilter
							blockClassName={styles.filterGroup}
							inputsClassName={styles.priceInputs}
						/>
					</div>

					<div className={styles.footer}>
						<button type="button" className={styles.resetButton} onClick={closeMenu}>Reset</button>
						<button type="button" className={styles.applyButton} onClick={closeMenu}>Apply Filters</button>
					</div>
				</div>
			</div>
		</>
	);
}
