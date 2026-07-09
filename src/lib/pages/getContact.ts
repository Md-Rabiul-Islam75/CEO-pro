import { prisma } from "../prisma";
import { pageKey } from "../pageContent";
import { withContactDefaults, type ContactContent } from "./contact";

/** Server-only reader for the Contact page content. */
export async function getContact(): Promise<ContactContent> {
  const row = await prisma.setting.findUnique({
    where: { key: pageKey("contact") },
  });
  return withContactDefaults(row?.value);
}
