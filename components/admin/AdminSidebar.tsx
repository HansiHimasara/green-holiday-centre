"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import { useState } from "react";

import Logo from "@/components/common/logo";

type AdminSidebarProps = {
  isSuperAdmin?: boolean;
  adminAccountsOpen?: boolean;
  onOpenAdminAccounts?: () => void;
};

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: "dashboard",
  },
  {
    label: "Bookings",
    href: "/admin/bookings",
    icon: "bookings",
  },
  {
    label: "Vehicles",
    href: "/admin/vehicles",
    icon: "vehicles",
  },
  {
    label: "Pricing",
    href: "/admin/pricing",
    icon: "pricing",
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: "customers",
  },
  {
    label: "Feedback",
    href: "/admin/feedback",
    icon: "feedback",
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: "reports",
  },
  {
    label: "Backup",
    href: "/admin/backup",
    icon: "backup",
  },
  {
    label: "Profile",
    href: "/admin/profile",
    icon: "profile",
  },
];

export default function AdminSidebar({
  isSuperAdmin = false,
  adminAccountsOpen = false,
  onOpenAdminAccounts,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);

      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        console.error(
          "Logout request failed."
        );
      }
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      router.replace(
        "/admin/login"
      );

      router.refresh();

      setLoggingOut(false);
    }
  }

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-[240px] flex-col bg-[#0B7656] px-5 py-7 text-white">
      <div className="mb-8">
        <Logo
          size="small"
          variant="white"
        />
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {menuItems.map((item) => {
          if (
            item.label === "Profile" &&
            isSuperAdmin
          ) {
            return (
              <div key="profile-group">
                <button
                  type="button"
                  onClick={
                    onOpenAdminAccounts
                  }
                  className={`mb-2 flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-sm transition-colors ${
                    adminAccountsOpen
                      ? "bg-[#439646] font-semibold text-white"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  <span className="text-[#90C543]">
                    <SidebarIcon type="adminAccounts" />
                  </span>

                  Admin Accounts
                </button>

                <SidebarLink
                  item={item}
                  pathname={pathname}
                />
              </div>
            );
          }

          return (
            <SidebarLink
              key={item.href}
              item={item}
              pathname={pathname}
            />
          );
        })}
      </nav>

      <div className="border-t border-white/15 pt-5">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-sm text-white/90 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="#90C543"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H4" />
            <path d="M14 4h6v16h-6" />
          </svg>

          {loggingOut
            ? "Logging Out..."
            : "Log Out"}
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({
  item,
  pathname,
}: {
  item: {
    label: string;
    href: string;
    icon: string;
  };
  pathname: string;
}) {
  const active =
    pathname === item.href ||
    (item.href !==
      "/admin/dashboard" &&
      pathname.startsWith(
        `${item.href}/`
      ));

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-4 rounded-lg px-4 py-3 text-sm transition-colors ${
        active
          ? "bg-[#439646] font-semibold text-white"
          : "text-white/90 hover:bg-white/10"
      }`}
    >
      <span className="text-[#90C543]">
        <SidebarIcon
          type={item.icon}
        />
      </span>

      {item.label}
    </Link>
  );
}

function SidebarIcon({
  type,
}: {
  type: string;
}) {
  const props = {
    viewBox: "0 0 24 24",
    width: 20,
    height: 20,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap:
      "round" as const,
    strokeLinejoin:
      "round" as const,
  };

  if (type === "dashboard") {
    return (
      <svg {...props}>
        <rect
          x="4"
          y="4"
          width="6"
          height="6"
        />
        <rect
          x="14"
          y="4"
          width="6"
          height="6"
        />
        <rect
          x="4"
          y="14"
          width="6"
          height="6"
        />
        <rect
          x="14"
          y="14"
          width="6"
          height="6"
        />
      </svg>
    );
  }

  if (type === "bookings") {
    return (
      <svg {...props}>
        <rect
          x="4"
          y="5"
          width="16"
          height="15"
          rx="2"
        />
        <path d="M8 3v4M16 3v4M4 9h16" />
      </svg>
    );
  }

  if (type === "vehicles") {
    return (
      <svg {...props}>
        <path d="M5 16h14l-1.5-6h-11L5 16z" />
        <circle
          cx="8"
          cy="17"
          r="1.5"
        />
        <circle
          cx="16"
          cy="17"
          r="1.5"
        />
      </svg>
    );
  }

  if (type === "pricing") {
    return (
      <svg {...props}>
        <rect
          x="4"
          y="6"
          width="16"
          height="12"
          rx="2"
        />
        <path d="M4 10h16" />
      </svg>
    );
  }

  if (type === "customers") {
    return (
      <svg {...props}>
        <circle
          cx="9"
          cy="8"
          r="3"
        />
        <circle
          cx="17"
          cy="9"
          r="2"
        />
        <path d="M4 19c0-3 2-5 5-5s5 2 5 5" />
        <path d="M15 14c3 0 5 2 5 5" />
      </svg>
    );
  }

  if (type === "feedback") {
    return (
      <svg {...props}>
        <path d="M4 5h16v12H8l-4 3V5z" />
      </svg>
    );
  }

  if (type === "reports") {
    return (
      <svg {...props}>
        <path d="M5 20V12M10 20V8M15 20V4M20 20V10" />
      </svg>
    );
  }

  if (type === "backup") {
    return (
      <svg {...props}>
        <ellipse
          cx="12"
          cy="6"
          rx="6"
          ry="3"
        />
        <path d="M6 6v6c0 1.7 2.7 3 6 3s6-1.3 6-3V6" />
        <path d="M6 12v6c0 1.7 2.7 3 6 3s6-1.3 6-3v-6" />
      </svg>
    );
  }

  if (
    type ===
    "adminAccounts"
  ) {
    return (
      <svg {...props}>
        <circle
          cx="9"
          cy="8"
          r="3"
        />
        <path d="M4 19c0-3 2-5 5-5s5 2 5 5" />
        <path d="M16 8h4" />
        <path d="M18 6v4" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <circle
        cx="12"
        cy="8"
        r="3"
      />
      <path d="M6 20c0-4 2.5-6 6-6s6 2 6 6" />
    </svg>
  );
}