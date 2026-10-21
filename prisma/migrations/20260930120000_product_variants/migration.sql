ALTER TABLE "products" ADD COLUMN "parent_id" TEXT;

CREATE INDEX "products_parent_id_idx" ON "products"("parent_id");

WITH ranked_products AS (
  SELECT
    "id",
    FIRST_VALUE("id") OVER (
      PARTITION BY "product_code"
      ORDER BY "article_id"
    ) AS "parent_id",
    ROW_NUMBER() OVER (
      PARTITION BY "product_code"
      ORDER BY "article_id"
    ) AS "row_number"
  FROM "products"
)
UPDATE "products" AS product
SET "parent_id" = ranked_products."parent_id"
FROM ranked_products
WHERE product."id" = ranked_products."id"
  AND ranked_products."row_number" > 1;

ALTER TABLE "products"
ADD CONSTRAINT "products_parent_id_fkey"
FOREIGN KEY ("parent_id") REFERENCES "products"("id")
ON DELETE SET NULL ON UPDATE CASCADE;