import type { ReactNode } from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopHeader from "@/components/admin/AdminTopHeader";
import AdminFooter from "@/components/admin/AdminFooter";

interface AdminPageLayoutProps {
  sectionTitle: string;
  children: ReactNode;
}

export default function AdminPageLayout({
  sectionTitle,
  children,
}: AdminPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F6F8F5]">
      <AdminSidebar />

      <div className="ml-[240px] flex min-h-screen flex-col">
        <AdminTopHeader sectionTitle={sectionTitle} />

        <main className="flex-1 px-10 py-8">{children}</main>

        <AdminFooter />
      </div>
    </div>
  );
}