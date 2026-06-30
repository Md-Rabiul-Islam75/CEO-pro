import Sidebar from "@/components/Sidebar";

/** Public site layout — fixed left sidebar + offset content. */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidebar />
      <main className="lg:pl-[var(--sidebar-width)]">
        <div className="pt-16 lg:pt-0">{children}</div>
      </main>
    </>
  );
}
