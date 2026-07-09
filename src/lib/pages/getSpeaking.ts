import { prisma } from "../prisma";
import { pageKey } from "../pageContent";
import { withSpeakingDefaults, type SpeakingContent } from "./speaking";

/** Server-only reader for the Speaking & Consulting page content. */
export async function getSpeaking(): Promise<SpeakingContent> {
  const row = await prisma.setting.findUnique({
    where: { key: pageKey("speaking") },
  });
  return withSpeakingDefaults(row?.value);
}
