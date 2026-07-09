import { prisma } from "../prisma";
import { pageKey } from "../pageContent";
import { withCaseStudiesDefaults, type CaseStudiesContent } from "./caseStudies";

/** Server-only reader for the Clients & Case Studies page content. */
export async function getCaseStudies(): Promise<CaseStudiesContent> {
  const row = await prisma.setting.findUnique({
    where: { key: pageKey("case-studies") },
  });
  return withCaseStudiesDefaults(row?.value);
}
