import { notFound } from "next/navigation";
import { getAllCategoriesFlat } from "@/lib/categoryQueries";
import { buildCategoryWithParents } from "@/lib/categoryTree";
import prisma from "@/lib/prisma";
import { getLatestProducts } from "@/lib/productQueries";
import { productCardSelect } from "@/lib/productSelect";
import ProductPage from "./ProductPage";

const productCharacteristicsSelect = {
  productTypeName: true,
  productGroupName: true,
  graphicalAppearanceName: true,
  colourGroupName: true,
  perceivedColourValueName: true,
  sectionName: true,
  garmentGroupName: true,
};

const productVariantDetailSelect = {
  ...productCardSelect.variants.select,
  ...productCharacteristicsSelect,
};

const productDetailSelect = {
  ...productCardSelect,
  ...productCharacteristicsSelect,
  categoryId: true,
  parent: {
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      images: true,
      description: true,
      badges: true,
      ...productCharacteristicsSelect,
      variants: { select: productVariantDetailSelect },
    },
  },
  variants: { select: productVariantDetailSelect },
};

export default async function Page({ params }) {
  const { slug } = await params;

  const [product, flatCategories, latestProducts] = await Promise.all([
    prisma.product.findUnique({
      where: { slug },
      select: productDetailSelect,
    }),
    getAllCategoriesFlat(),
    getLatestProducts(21),
  ]);

  if (!product) {
    notFound();
  }

  const category = buildCategoryWithParents(flatCategories, product.categoryId);
  const family = product.parent
    ? [product.parent, ...product.parent.variants]
    : [product, ...product.variants];
  const variantsByColor = new Map();
  for (const variant of family) {
    const colorKey =
      variant.colourGroupName?.trim().toLowerCase() || variant.id;
    if (!variantsByColor.has(colorKey) || variant.id === product.id) {
      variantsByColor.set(colorKey, variant);
    }
  }
  const variants = [...variantsByColor.values()].map((variant) => ({
    id: variant.id,
    title: variant.title,
    slug: variant.slug,
    price: Number(variant.price),
    images: variant.images,
    description: variant.description,
    badges: variant.badges,
    productTypeName: variant.productTypeName,
    productGroupName: variant.productGroupName,
    graphicalAppearanceName: variant.graphicalAppearanceName,
    colourGroupName: variant.colourGroupName,
    perceivedColourValueName: variant.perceivedColourValueName,
    sectionName: variant.sectionName,
    garmentGroupName: variant.garmentGroupName,
  }));
  const familyIds = new Set(variants.map((variant) => variant.id));
  const initialProducts = latestProducts
    .filter((p) => !familyIds.has(p.id))
    .slice(0, 20);
  const { categoryId: _categoryId, parent: _parent, ...productData } = product;

  return (
    <ProductPage
      product={{
        ...productData,
        price: Number(productData.price),
        variants,
        category,
      }}
      initialProducts={initialProducts}
    />
  );
}
