export function buildCategoriesByParentId(categories) {
  const categoriesByParentId = new Map();

  for (const category of categories) {
    const parentId = category.parentId ?? null;
    const siblings = categoriesByParentId.get(parentId) ?? [];
    siblings.push(category);
    categoriesByParentId.set(parentId, siblings);
  }

  return categoriesByParentId;
}

export function resolveCategoryByPath(categories, categoryPath) {
  if (!categoryPath?.length) return null;

  const categoriesByParentId = buildCategoriesByParentId(categories);
  let parentId = null;
  let selectedCategory = null;

  for (const slug of categoryPath) {
    selectedCategory =
      categoriesByParentId
        .get(parentId)
        ?.find((category) => category.slug === slug) ?? null;

    if (!selectedCategory) return null;
    parentId = selectedCategory.id;
  }

  return selectedCategory;
}

export function collectDescendantCategoryIds(categories, rootCategoryId) {
  const categoriesByParentId = buildCategoriesByParentId(categories);
  const categoryIds = [rootCategoryId];
  const queue = [rootCategoryId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    const children = categoriesByParentId.get(currentId) ?? [];

    for (const child of children) {
      if (!categoryIds.includes(child.id)) {
        categoryIds.push(child.id);
        queue.push(child.id);
      }
    }
  }

  return categoryIds;
}

export function buildCategoryWithParents(categories, categoryId) {
  if (!categoryId) return null;

  const categoriesById = new Map(
    categories.map((category) => [category.id, category]),
  );
  const chain = [];
  let current = categoriesById.get(categoryId);

  while (current) {
    chain.push({
      name: current.name,
      slug: current.slug,
    });
    current = current.parentId ? categoriesById.get(current.parentId) : null;
  }

  if (chain.length === 0) return null;

  let node = null;
  for (let index = chain.length - 1; index >= 0; index -= 1) {
    node = { ...chain[index], parent: node };
  }

  return node;
}

export function buildCatalogFilterCategories(flatCategories) {
  const categoriesByParentId = buildCategoriesByParentId(flatCategories);
  const rootCategories = categoriesByParentId.get(null) ?? [];

  return rootCategories.map((parent) => ({
    id: parent.id,
    name: parent.name,
    slug: parent.slug,
    children: (categoriesByParentId.get(parent.id) ?? []).map((child) => ({
      id: child.id,
      name: child.name,
      slug: child.slug,
    })),
  }));
}
