/**
 * Створює масив для Хлібних Крихт
 * @param {Object} options
 * @param {Object} [options.category] - Об'єкт категорії (з включеним parent)
 * @param {Object} [options.product] - Об'єкт товару (з включеною category)
 * @param {Array} [options.extraItems] - Додаткові кастомні кроки (наприклад, [{ label: 'Блог', href: '/blog' }])
 */
export function getBreadcrumbItems({
  category,
  product,
  extraItems = [],
} = {}) {
  const items = [{ label: "Home", href: "/" }];

  if (extraItems.length > 0) {
    items.push(...extraItems);
  }

  const targetCategory = category || product?.category;

  if (targetCategory) {
    const categoryChain = [];
    let currentCat = targetCategory;

    while (currentCat) {
      categoryChain.unshift({
        label: currentCat.name,
        slug: currentCat.slug,
      });
      currentCat = currentCat.parent;
    }

    items.push(
      ...categoryChain.map((item, index) => ({
        label: item.label,
        href: `/catalog/${categoryChain
          .slice(0, index + 1)
          .map((category) => category.slug)
          .join("/")}`,
      })),
    );
  }

  if (product) {
    items.push({
      label: product.title,
    });
  } else if (category && items.length > 0) {
    const lastItem = items[items.length - 1];
    if (lastItem) {
      delete lastItem.href;
    }
  }

  return items;
}
