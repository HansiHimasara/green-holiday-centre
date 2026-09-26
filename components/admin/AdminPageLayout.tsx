"use client";

import type { ReactNode } from "react";
import {
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopHeader from "@/components/admin/AdminTopHeader";
import AdminFooter from "@/components/admin/AdminFooter";

type UserRole =
  | "ADMIN"
  | "SUPER_ADMIN";

type CurrentAdmin = {
  id: number;
  fullName: string;
  username: string | null;
  email: string;
  role: UserRole;
};

interface AdminPageLayoutProps {
  sectionTitle: string;
  children: ReactNode;

  // Keep this for existing dashboard compatibility
  isSuperAdmin?: boolean;

  adminAccountsOpen?: boolean;
  onOpenAdminAccounts?: () => void;
}

export default function AdminPageLayout({
  sectionTitle,
  children,
  adminAccountsOpen = false,
  onOpenAdminAccounts,
}: AdminPageLayoutProps) {
  const router = useRouter();

  const [
    currentAdmin,
    setCurrentAdmin,
  ] = useState<CurrentAdmin | null>(
    null
  );

  const [
    checkingSession,
    setCheckingSession,
  ] = useState(true);

  // Check logged-in Admin session
  useEffect(() => {
    let cancelled = false;

    async function checkAdminSession() {
      try {
        const response =
          await fetch(
            "/api/auth/me",
            {
              method: "GET",
              cache: "no-store",
            }
          );

        if (!response.ok) {
          router.replace(
            "/admin/login"
          );
          return;
        }

        const data =
          await response.json();

        if (
          !data.user ||
          (
            data.user.role !==
              "ADMIN" &&
            data.user.role !==
              "SUPER_ADMIN"
          )
        ) {
          router.replace(
            "/admin/login"
          );
          return;
        }

        if (!cancelled) {
          setCurrentAdmin(
            data.user as CurrentAdmin
          );
        }
      } catch (error) {
        console.error(
          "Admin session check failed:",
          error
        );

        router.replace(
          "/admin/login"
        );
      } finally {
        if (!cancelled) {
          setCheckingSession(
            false
          );
        }
      }
    }

    void checkAdminSession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  // Loading screen
  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F8F5]">
        <p className="text-sm font-semibold text-[var(--green-primary)]">
          Checking administrator session...
        </p>
      </div>
    );
  }

  if (!currentAdmin) {
    return null;
  }

  // Role comes only from database/session
  const isCurrentUserSuperAdmin =
    currentAdmin.role ===
    "SUPER_ADMIN";

  return (
    <div className="min-h-screen bg-[#F6F8F5]">
      <AdminSidebar
        isSuperAdmin={
          isCurrentUserSuperAdmin
        }
        adminAccountsOpen={
          adminAccountsOpen
        }
        onOpenAdminAccounts={
          onOpenAdminAccounts
        }
      />

      <div className="ml-[240px] flex min-h-screen flex-col">
        <AdminTopHeader
          sectionTitle={
            sectionTitle
          }
          adminName={
            currentAdmin.fullName
          }
          adminRole={
            currentAdmin.role
          }
        />

        <main className="flex-1 px-10 py-8">
          {children}
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}