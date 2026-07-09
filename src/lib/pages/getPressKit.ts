import { prisma } from "../prisma";
import { pageKey } from "../pageContent";
import { withPressKitDefaults, type PressKitContent } from "./pressKit";

/** Server-only reader for the Press Kit page content. */
export async function getPressKit(): Promise<PressKitContent> {
  const row = await prisma.setting.findUnique({
    where: { key: pageKey("press-kit") },
  });
  return withPressKitDefaults(row?.value);
}
