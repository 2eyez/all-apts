"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const quickActions = [
  {
    title: "Add Apartment",
    description: "List a new shortlet",
    href: "/dashboard/owner/apartments",
    icon: "ri-home-5-line",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "View Calendar",
    description: "Manage availability",
    href: "/dashboard/owner/calendar",
    icon: "ri-calendar-schedule-line",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "Manage Bookings",
    description: "View your reservations",
    href: "/dashboard/owner/bookings",
    icon: "ri-calendar-check-line",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Manage Staff",
    description: "Manage your team",
    href: "/dashboard/owner/staff",
    icon: "ri-team-line",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    title: "Maintenance",
    description: "Track property issues",
    href: "/dashboard/owner/maintenance",
    icon: "ri-tools-line",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
  },
  {
    title: "View Reports",
    description: "Track performance",
    href: "/dashboard/owner/payments",
    icon: "ri-bar-chart-box-line",
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
];

export default function OwnerDashboardPage() {
  const [apartments, setApartments] = useState<
    {
      _id: string;
      title: string;
      price: number;
      discount?: number;
    }[]
  >([]);

  const [apartmentCount, setApartmentCount] = useState(0);

  const [ownerBookings, setOwnerBookings] = useState<
    {
      _id: string;
      guestName: string;
      checkIn: string;
      checkOut: string;
      nights: number;
      guests: number;
      pricePerNight: number;
      totalAmount: number;
      status: string;
      paymentStatus: string;
      apartmentId:
        | {
            title: string;
            city: string;
          }
        | string;
    }[]
  >([]);

  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const updateTime = () => {
      setCurrentHour(new Date().getHours());
    };

    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadOwnerStats() {
      try {
        const response = await fetch("/api/apartments?scope=owner");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load apartment data.");
        }

        setApartments(data.apartments || []);

        setApartmentCount(data.apartments?.length || 0);
      } catch (error) {
        console.error("OWNER OVERVIEW ERROR:", error);
        setStatsError(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data.",
        );
      } finally {
        setIsLoadingStats(false);
      }
    }

    async function loadOwnerBookings() {
      try {
        const response = await fetch("/api/bookings?scope=owner");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load booking data.");
        }

        setOwnerBookings(data.bookings || []);
      } catch (error) {
        console.error("OWNER BOOKINGS OVERVIEW ERROR:", error);
      }
    }

    loadOwnerStats();
    loadOwnerBookings();
  }, []);

  const { data: session } = useSession();
  const companyName = session?.user?.companyName || "Your Company";

  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 17
        ? "Good afternoon"
        : "Good evening";

  const totalBookings = ownerBookings.length;

  const totalGuests = new Set(ownerBookings.map((booking) => booking.guestName))
    .size;

  const totalRevenue = ownerBookings
    .filter((booking) => booking.paymentStatus === "paid")
    .reduce((total, booking) => total + booking.totalAmount, 0);

  const confirmedBookings = ownerBookings.filter(
    (booking) => booking.status === "confirmed",
  ).length;

  const pendingBookings = ownerBookings.filter(
    (booking) => booking.status === "pending",
  ).length;

  const cancelledBookings = ownerBookings.filter(
    (booking) => booking.status === "cancelled",
  ).length;

  const chartBars =
    ownerBookings.length > 0 ? ownerBookings.slice(0, 12).map(() => 100) : [0];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);

  const stats = [
    {
      title: "Total Apartments",
      value: isLoadingStats ? "—" : apartmentCount.toString(),
      description: "Properties you manage",
      icon: "ri-building-4-line",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Bookings",
      value: isLoadingStats ? "—" : totalBookings.toString(),
      description: "All reservations",
      icon: "ri-calendar-check-line",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Guests",
      value: isLoadingStats ? "—" : totalGuests.toString(),
      description: "Unique guests",
      icon: "ri-user-3-line",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Total Revenue",
      value: isLoadingStats ? "—" : formatCurrency(totalRevenue),
      description: "Paid bookings",
      icon: "ri-money-naira-circle-line",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        {/* Welcome */}
        <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
              Owner Overview
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 md:text-3xl">
              {greeting}, {companyName}
            </h1>

            <p className="mt-2 text-sm text-gray-500 md:text-base">
              Here&apos;s what&apos;s happening with your shortlet business.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <i className="ri-calendar-line text-xl" />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900">
                {new Date().toLocaleDateString("en-NG", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              <p className="mt-0.5 text-xs text-gray-500">
                Property management overview
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}
                >
                  <i className={`${stat.icon} text-xl`} />
                </div>

                <i className="ri-more-2-fill text-gray-300" />
              </div>

              <p className="mt-5 text-sm font-medium text-gray-500">
                {stat.title}
              </p>

              <p className="mt-1 text-2xl font-bold tracking-tight text-gray-950">
                {stat.value}
              </p>

              <p className="mt-2 text-xs text-gray-400">{stat.description}</p>
            </div>
          ))}
        </section>

        {/* Main dashboard grid */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Booking overview */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-950">
                    Booking Overview
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Monitor reservation activity across your properties.
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-500">
                  Current bookings
                </div>
              </div>

              <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_180px]">
                <div className="min-w-0">
                  <div className="relative h-56 overflow-hidden rounded-xl bg-gray-50/80 px-3 pb-4 pt-5">
                    <div className="absolute inset-x-3 top-8 border-t border-dashed border-gray-200" />
                    <div className="absolute inset-x-3 top-1/2 border-t border-dashed border-gray-200" />
                    <div className="absolute inset-x-3 bottom-10 border-t border-dashed border-gray-200" />

                    <div className="absolute inset-x-4 bottom-10 top-8 flex items-end justify-between gap-2">
                      {chartBars.map((height, index) => (
                        <div
                          key={index}
                          className="group relative flex h-full flex-1 items-end"
                        >
                          <div
                            className="w-full rounded-t-md bg-blue-500/80 transition group-hover:bg-blue-600"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[10px] text-gray-400">
                      {ownerBookings.length > 0 ? (
                        ownerBookings.slice(0, 4).map((booking) => (
                          <span key={booking._id}>
                            {new Date(booking.checkIn).toLocaleDateString(
                              "en-NG",
                              {
                                day: "numeric",
                                month: "short",
                              },
                            )}
                          </span>
                        ))
                      ) : (
                        <>
                          <span>No bookings</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                  <div className="rounded-xl bg-blue-50 p-4">
                    <p className="text-xs text-blue-600">Total bookings</p>
                    <p className="mt-2 text-2xl font-bold text-gray-950">
                      {totalBookings}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      All reservations
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-50 p-4">
                    <p className="text-xs text-green-600">Confirmed</p>
                    <p className="mt-2 text-2xl font-bold text-gray-950">
                      {confirmedBookings}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Confirmed reservations
                    </p>
                  </div>

                  <div className="rounded-xl bg-orange-50 p-4">
                    <p className="text-xs text-orange-600">Pending</p>
                    <p className="mt-2 text-2xl font-bold text-gray-950">
                      {pendingBookings}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Awaiting confirmation
                    </p>
                  </div>

                  <div className="rounded-xl bg-red-50 p-4">
                    <p className="text-xs text-red-600">Cancelled</p>
                    <p className="mt-2 text-2xl font-bold text-gray-950">
                      {cancelledBookings}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Cancelled reservations
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent bookings */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 md:px-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-950">
                    Recent Bookings
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Your latest property reservations.
                  </p>
                </div>

                <Link
                  href="/dashboard/owner/bookings"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View all
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {ownerBookings.length === 0 ? (
                  <div className="flex min-h-[230px] items-center justify-center px-6 py-10">
                    <div className="text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                        <i className="ri-calendar-check-line text-2xl" />
                      </div>
                      <h3 className="mt-4 text-sm font-semibold text-gray-900">
                        No owner bookings yet
                      </h3>
                      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-gray-500">
                        Once guests book one of your properties, your recent
                        reservations will appear here.
                      </p>
                    </div>
                  </div>
                ) : (
                  ownerBookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between gap-4 px-6 py-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {booking.guestName}
                        </p>
                        <p className="mt-1 truncate text-xs text-gray-500">
                          {typeof booking.apartmentId === "object"
                            ? `${booking.apartmentId.title} · ${booking.apartmentId.city}`
                            : "Apartment"}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(booking.totalAmount)}
                        </p>
                        <p className="mt-1 text-xs capitalize text-gray-500">
                          {booking.status}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Property performance */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-950">
                    Property Performance
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Track how your properties are performing.
                  </p>
                </div>

                <Link
                  href="/dashboard/owner/apartments"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View properties
                </Link>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Properties Listed</p>

                  <p className="mt-2 text-xl font-bold text-gray-950">
                    {isLoadingStats ? "—" : apartmentCount}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Active properties
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Average Nightly Rate</p>
                  <p className="mt-2 text-2xl font-bold text-gray-950">
                    {apartments.length > 0
                      ? formatCurrency(
                          apartments.reduce((total, apartment) => {
                            const nightlyPrice =
                              apartment.discount && apartment.discount > 0
                                ? apartment.price -
                                  (apartment.price * apartment.discount) / 100
                                : apartment.price;

                            return total + nightlyPrice;
                          }, 0) / apartments.length,
                        )
                      : "₦0"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Average across listed properties
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Occupancy Rate</p>

                  <p className="mt-2 text-2xl font-bold text-gray-950">
                    {apartmentCount > 0 && ownerBookings.length > 0
                      ? `${Math.min(
                          100,
                          Math.round(
                            (ownerBookings.reduce(
                              (total, booking) => total + booking.nights,
                              0,
                            ) /
                              (apartmentCount * 30)) *
                              100,
                          ),
                        )}%`
                      : "0%"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Based on booked nights
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-gray-50 px-4 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Property pricing
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Current nightly rates across your listed properties.
                    </p>
                  </div>

                  <i className="ri-bar-chart-2-line text-xl text-blue-600" />
                </div>

                {isLoadingStats ? (
                  <div className="mt-5 flex h-32 items-center justify-center">
                    <p className="text-sm text-gray-400">
                      Loading property data...
                    </p>
                  </div>
                ) : apartmentCount === 0 ? (
                  <div className="mt-5 flex h-32 items-center justify-center">
                    <div className="text-center">
                      <i className="ri-building-4-line text-3xl text-gray-300" />

                      <p className="mt-2 text-sm font-medium text-gray-700">
                        No properties listed yet
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Add an apartment to see property data here.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5">
                    <div className="flex h-32 items-end gap-3 rounded-xl bg-white px-4 pb-4 pt-4">
                      {apartments.length > 0 ? (
                        apartments.map((apartment, index) => {
                          const nightlyPrice =
                            apartment.discount && apartment.discount > 0
                              ? apartment.price -
                                (apartment.price * apartment.discount) / 100
                              : apartment.price;

                          const prices = apartments.map((item) =>
                            item.discount && item.discount > 0
                              ? item.price - (item.price * item.discount) / 100
                              : item.price,
                          );

                          const maxPrice = Math.max(...prices, 1);

                          const height = Math.max(
                            10,
                            Math.round((nightlyPrice / maxPrice) * 100),
                          );

                          return (
                            <div
                              key={apartment._id}
                              className="flex h-full flex-1 items-end"
                            >
                              <div
                                className="w-full rounded-t-md bg-blue-500/70"
                                style={{ height: `${height}%` }}
                              />
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                          No apartments listed yet
                        </div>
                      )}
                    </div>

                    <p className="mt-3 text-center text-xs text-gray-400">
                      {apartmentCount}{" "}
                      {apartmentCount === 1 ? "property" : "properties"}{" "}
                      currently listed
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Quick actions */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <h2 className="text-lg font-semibold text-gray-950">
                  Quick Actions
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Get to the tools you use most.
                </p>
              </div>

              <div className="mt-5 space-y-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="group flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:border-blue-100 hover:bg-blue-50/50"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.iconBg} ${action.iconColor}`}
                    >
                      <i className={`${action.icon} text-lg`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {action.title}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {action.description}
                      </p>
                    </div>

                    <i className="ri-arrow-right-s-line text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-950">
                    Calendar
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Your property availability.
                  </p>
                </div>

                <Link
                  href="/dashboard/owner/calendar"
                  className="text-sm font-medium text-blue-600"
                >
                  View
                </Link>
              </div>

              <div className="mt-5 rounded-xl bg-gray-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Upcoming bookings
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-950">
                      {
                        ownerBookings.filter(
                          (booking) => new Date(booking.checkIn) >= new Date(),
                        ).length
                      }
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <i className="ri-calendar-2-line text-2xl" />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {ownerBookings
                    .filter(
                      (booking) => new Date(booking.checkIn) >= new Date(),
                    )
                    .slice(0, 3)
                    .map((booking) => (
                      <div
                        key={booking._id}
                        className="flex items-center justify-between rounded-lg bg-white px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-gray-900">
                            {booking.guestName}
                          </p>
                          <p className="truncate text-[11px] text-gray-500">
                            {typeof booking.apartmentId === "object"
                              ? booking.apartmentId.title
                              : "Apartment"}
                          </p>
                        </div>

                        <p className="shrink-0 text-[11px] font-medium text-blue-600">
                          {new Date(booking.checkIn).toLocaleDateString(
                            "en-NG",
                            {
                              day: "numeric",
                              month: "short",
                            },
                          )}
                        </p>
                      </div>
                    ))}

                  {ownerBookings.filter(
                    (booking) => new Date(booking.checkIn) >= new Date(),
                  ).length === 0 && (
                    <p className="py-3 text-center text-xs text-gray-500">
                      No upcoming bookings.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent activity */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-950">
                    Recent Activity
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Activity across your business.
                  </p>
                </div>

                <i className="ri-pulse-line text-xl text-blue-500" />
              </div>

              <div className="mt-5 rounded-xl bg-gray-50 p-4">
                {ownerBookings.length === 0 ? (
                  <div className="py-5 text-center">
                    <i className="ri-history-line text-3xl text-gray-300" />
                    <p className="mt-3 text-sm font-medium text-gray-700">
                      No activity yet
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Business activity will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ownerBookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking._id}
                        className="flex items-start gap-3 rounded-xl bg-white p-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <i className="ri-calendar-check-line" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-900">
                            {booking.guestName} made a booking
                          </p>

                          <p className="mt-1 truncate text-[11px] text-gray-500">
                            {typeof booking.apartmentId === "object"
                              ? booking.apartmentId.title
                              : "Apartment"}
                          </p>

                          <p className="mt-1 text-[10px] text-gray-400">
                            {new Date(booking.checkIn).toLocaleDateString(
                              "en-NG",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Owner website */}
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#071d3b] to-[#0d3b75] p-6 text-white shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <i className="ri-global-line text-xl" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-blue-300">
                Owner Website
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Your own booking website
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/65">
                Manage your branded property website and give guests another way
                to discover and book your apartments.
              </p>

              <Link
                href="/dashboard/owner/website"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Manage Website
                <i className="ri-arrow-right-line" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
