export const productCardSelect = {
  id: true,
  title: true,
  slug: true,
  price: true,
  images: true,
  description: true,
  badges: true,
  colourGroupName: true,
  variants: {
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      images: true,
      colourGroupName: true,
    },
  },
};

export function toProductCardData(product) {
  if (!product?.id) return null;

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    price: Number(product.price),
    images: Array.isArray(product.images) ? product.images.slice(0, 2) : [],
    description: product.description ?? null,
    badges: Array.isArray(product.badges) ? product.badges : [],
    colourGroupName: product.colourGroupName ?? null,
    variants: [product, ...(product.variants ?? [])].map((variant) => ({
      id: variant.id,
      title: variant.title,
      slug: variant.slug,
      price: Number(variant.price),
      images: Array.isArray(variant.images) ? variant.images : [],
      colourGroupName: variant.colourGroupName ?? null,
    })),
  };
}

export function orderProductsByIds(products, ids) {
  const byId = new Map(products.map((product) => [product.id, product]));
  return ids.map((id) => byId.get(id)).filter(Boolean);
}
