/**
 * "Products & Platforms" page content — a banner plus a grid of product cards.
 * Stored under key "page:products". (Client-safe: no Prisma here.)
 */

export type Product = {
  id: string;
  image: string;
  name: string;
  category: string;
  description: string;
  link: string;
};

export type ProductsContent = {
  banner: { image: string; headline: string; intro: string };
  products: Product[];
};

export const DEFAULT_PRODUCTS: ProductsContent = {
  banner: {
    image: "",
    headline: "Products & Platforms",
    intro:
      "Systems and platforms I've designed and shipped across utility, telecom, healthcare and finance — built for scale, compliance and real-world operations.",
  },
  products: [
    { id: "p1", image: "", name: "Hospital ERP", category: "Healthcare", description: "Micro-service Hospital ERP with HL7 & DICOM support — patient management, diagnostics, pharmacy, billing and analytics.", link: "" },
    { id: "p2", image: "", name: "Government MIS", category: "Government", description: "SaaS management information system for public-sector operations, reporting and service delivery.", link: "" },
    { id: "p3", image: "", name: "Unified Prepayment / AMI", category: "Utility", description: "Advanced Metering Infrastructure with STS, DLMS/COSEM and IDIS — secure prepayment at national scale.", link: "" },
    { id: "p4", image: "", name: "Meter Data Management (MDM)", category: "Utility", description: "Centralized meter data collection, validation, estimation and analytics for utilities.", link: "" },
    { id: "p5", image: "", name: "Telecom ICX Billing", category: "Telecom", description: "International Carrier Exchange billing and mediation for telecom operators.", link: "" },
    { id: "p6", image: "", name: "Broker Securities System", category: "Finance", description: "Back-office, online trading and investor community platform for brokerage houses.", link: "" },
  ],
};

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);

function coerceProduct(v: Partial<Product>, i: number): Product {
  return {
    id: str(v.id) || `p-${i}`,
    image: str(v.image),
    name: str(v.name),
    category: str(v.category),
    description: str(v.description),
    link: str(v.link),
  };
}

export function withProductsDefaults(value: unknown): ProductsContent {
  const v = (value ?? {}) as Partial<ProductsContent>;
  return {
    banner: { ...DEFAULT_PRODUCTS.banner, ...(v.banner ?? {}) },
    products: Array.isArray(v.products)
      ? v.products.map(coerceProduct)
      : DEFAULT_PRODUCTS.products,
  };
}
