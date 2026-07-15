import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin · ABM Whaiduzzaman",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar + mobile top bar & drawer live in AdminSidebar. */}
      <AdminSidebar />

      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10">{children}</div>
      </div>
    </div>
  );
}
