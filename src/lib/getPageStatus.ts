import { prisma } from "./prisma";
import { withStatusDefaults, isPublished, type PageStatusMap } from "./pageStatus";

/** Server-only reader for the page-status override map. */
export async function getPageStatusMap(): Promise<PageStatusMap> {
  const row = await prisma.setting.findUnique({ where: { key: "pageStatus" } });
  return withStatusDefaults(row?.value);
}

/** Whether a public page (by href) is currently published. */
export async function isPagePublished(href: string): Promise<boolean> {
  return isPublished(await getPageStatusMap(), href);
}
