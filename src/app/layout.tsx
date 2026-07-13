import type { Metadata } from "next";
import "./globals.css";
import { getSettings } from "@/lib/getSettings";

/** Metadata is dynamic so the favicon follows the uploaded brand mark. Prefer
 *  the square favicon tile (legible on light tabs); fall back to the signature. */
export async function generateMetadata(): Promise<Metadata> {
  // The database may be unreachable at build time (e.g. `docker build` before
  // Postgres is up) — fall back to no custom icon rather than failing the build.
  let icon: string | undefined;
  try {
    const { brand } = await getSettings();
    icon = brand.favicon || brand.signature || undefined;
  } catch {
    icon = undefined;
  }
  return {
    title:
      "ABM Whaiduzzaman — builds technology · trains entrepreneurs · creates brands",
    description:
      "The official site of ABM Whaiduzzaman: technologist, entrepreneur educator (One-Focus), and brand builder.",
    icons: icon ? { icon } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
