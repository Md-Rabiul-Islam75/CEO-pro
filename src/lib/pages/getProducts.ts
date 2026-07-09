import { prisma } from "../prisma";
import { pageKey } from "../pageContent";
import { withProductsDefaults, type ProductsContent } from "./products";

/** Server-only reader for the Products & Platforms page content. */
export async function getProducts(): Promise<ProductsContent> {
  const row = await prisma.setting.findUnique({
    where: { key: pageKey("products") },
  });
  return withProductsDefaults(row?.value);
}
