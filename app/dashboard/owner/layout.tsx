"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

const mainNavigation = [
  {
    name: "Overview",
    href: "/dashboard/owner",
    icon: "ri-dashboard-line",
  },
  {
    name: "Apartments",
    href: "/dashboard/owner/apartments",
    icon: "ri-building-4-line",
  },
  {
    name: "Bookings",
    href: "/dashboard/owner/bookings",
    icon: "ri-calendar-check-line",
  },
  {
    name: "Calendar",
    href: "/dashboard/owner/calendar",
    icon: "ri-calendar-schedule-line",
  },
  {
    name: "Guests",
    href: "/dashboard/owner/guests",
    icon: "ri-user-3-line",
  },
  {
    name: "Staff",
    href: "/dashboard/owner/staff",
    icon: "ri-team-line",
  },
  {
    name: "Maintenance",
    href: "/dashboard/owner/maintenance",
    icon: "ri-tools-line",
  },
  {
    name: "Payroll",
    href: "/dashboard/owner/payroll",
    icon: "ri-wallet-3-line",
  },
  {
    name: "Owner Website",
    href: "/dashboard/owner/website",
    icon: "ri-global-line",
  },
  {
    name: "Payments",
    href: "/dashboard/owner/payments",
    icon: "ri-bank-card-line",
  },
];

const accountNavigation = [
  {
    name: "Settings",
    href: "/dashboard/owner/settings",
    icon: "ri-settings-3-line",
  },
];

export default function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<
    {
      _id: string;
      title: string;
      message: string;
      isRead: boolean;
      createdAt: string;
    }[]
  >([]);

  const isActive = (href: string) => {
    if (href === "/dashboard/owner") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  useEffect(() => {
    async function loadPendingBookingsCount() {
      try {
        const response = await fetch("/api/bookings?scope=owner");
        const data = await response.json();

        if (!response.ok || !data.success) {
          return;
        }

        const pendingCount = (data.bookings || []).filter(
          (booking: { status: string }) => booking.status === "pending",
        ).length;

        setPendingBookingsCount(pendingCount);
      } catch (error) {
        console.error("PENDING BOOKINGS COUNT ERROR:", error);
      }
    }

    async function loadNotificationsCount() {
      try {
        const response = await fetch("/api/notifications");
        const data = await response.json();

        if (!response.ok || !data.success) {
          return;
        }

        console.log("NOTIFICATION API DATA:", data);
        setNotifications(data.notifications || []);
        setUnreadNotificationsCount(data.unreadCount || 0);
      } catch (error) {
        console.error("NOTIFICATIONS COUNT ERROR:", error);
      }
    }

    const handleBookingsUpdated = () => {
      loadPendingBookingsCount();
      loadNotificationsCount();
    };

    loadPendingBookingsCount();
    loadNotificationsCount();

    window.addEventListener("owner-bookings-updated", handleBookingsUpdated);

    return () => {
      window.removeEventListener(
        "owner-bookings-updated",
        handleBookingsUpdated,
      );
    };
  }, []);

  const ownerName = session?.user?.name || "Owner";

  const companyName = session?.user?.companyName || "All-Apts Owner";

  const ownerInitial = ownerName.charAt(0).toUpperCase() || "O";

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-gray-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#071d3b] text-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[76px] items-center border-b border-white/10 px-6">
          <Link
            href="/dashboard/owner"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center"
          >
            <span className="text-[25px] font-bold tracking-tight text-white">
              All
            </span>

            <span className="text-[25px] font-bold tracking-tight text-blue-400">
              Apts
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        {/* Dashboard label */}
        <div className="px-5 pt-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
              Owner Dashboard
            </p>

            <span className="rounded-full bg-blue-500/20 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-blue-300">
              Owner
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-4 flex-1 overflow-y-auto px-3 pb-4">
          <nav className="space-y-1">
            {mainNavigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                      : "text-white/70 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <i
                    className={`${item.icon} text-[19px] ${
                      active
                        ? "text-white"
                        : "text-white/55 group-hover:text-white"
                    }`}
                  />

                  <span>{item.name}</span>

                  {item.name === "Bookings" && (
                    <span
                      className={`ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {pendingBookingsCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="my-6 h-px bg-white/10" />

          <p className="px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
            Account
          </p>

          <nav className="mt-2 space-y-1">
            {accountNavigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-white/70 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <i
                    className={`${item.icon} text-[19px] ${
                      active
                        ? "text-white"
                        : "text-white/55 group-hover:text-white"
                    }`}
                  />

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Owner profile */}
        <div className="border-t border-white/10 p-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                {ownerInitial}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {companyName}
                </p>

                <p className="mt-0.5 truncate text-xs text-white/45">
                  {ownerName}
                </p>
              </div>

              <i className="ri-more-2-fill text-white/40" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <i className="ri-logout-box-r-line text-lg" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main application */}
      <div className="min-h-screen lg:pl-[260px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center border-b border-gray-200 bg-white/95 px-4 backdrop-blur md:px-6">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 lg:hidden"
          >
            <i className="ri-menu-line text-xl" />
          </button>

          {/* Search */}
          <div className="ml-3 hidden w-full max-w-[430px] md:block lg:ml-0">
            <div className="flex h-11 items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-blue-300 focus-within:bg-white">
              <i className="ri-search-line text-lg text-gray-400" />

              <input
                type="text"
                placeholder="Search apartments, bookings, guests..."
                className="ml-3 w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2 md:gap-4">
            {/* Mobile search */}
            <button
              type="button"
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 md:hidden"
            >
              <i className="ri-search-line text-xl" />
            </button>

            {/* Notifications */}
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => {
                setShowNotifications((current) => !current);
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <i className="ri-notification-3-line text-xl" />

              {unreadNotificationsCount > 0 && (
                <span className="absolute right-0 top-0 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadNotificationsCount > 9
                    ? "9+"
                    : unreadNotificationsCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 z-50 w-[360px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Notifications
                  </h3>

                  {unreadNotificationsCount > 0 && (
                    <span className="text-xs text-gray-500">
                      {unreadNotificationsCount} unread
                    </span>
                  )}
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.filter((notification) => !notification.isRead)
                    .length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    notifications
                      .filter((notification) => !notification.isRead)
                      .slice(0, 1)
                      .map((notification) => (
                        <div
                          key={notification._id}
                          onClick={async () => {
                            try {
                              const response = await fetch(
                                "/api/notifications",
                                {
                                  method: "PATCH",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    notificationId: notification._id,
                                  }),
                                },
                              );

                              const data = await response.json();

                              if (response.ok && data.success) {
                                setNotifications((current) =>
                                  current.map((item) =>
                                    item._id === notification._id
                                      ? { ...item, isRead: true }
                                      : item,
                                  ),
                                );

                                setUnreadNotificationsCount(
                                  data.unreadCount || 0,
                                );
                              } else {
                                console.error(
                                  "FAILED TO MARK NOTIFICATION READ:",
                                  data,
                                );
                              }
                            } catch (error) {
                              console.error(
                                "MARK NOTIFICATION READ ERROR:",
                                error,
                              );
                            }
                          }}
                          className="cursor-pointer border-b border-gray-100 px-4 py-4 transition hover:bg-gray-50"
                        >
                          <p className="text-sm font-semibold text-gray-900">
                            {notification.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-gray-600">
                            {notification.message}
                          </p>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
            <div className="hidden h-8 w-px bg-gray-200 sm:block" />

            {/* User */}
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  {ownerName}
                </p>

                <p className="text-[11px] text-gray-500">{companyName}</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {ownerInitial}
              </div>

              <i className="ri-arrow-down-s-line hidden text-gray-400 sm:block" />
            </div>
          </div>
        </header>

        {/* Dashboard page */}
        <main>{children}</main>
      </div>
    </div>
  );
}
