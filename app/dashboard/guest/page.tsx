"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Apartment {
  _id: string;
  title: string;
  location: string;
  city: string;
  images?: string[];
}

interface Booking {
  _id: string;
  apartmentId: Apartment | null;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  pricePerNight: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export default function GuestDashboardPage() {
  const { data: session, status } = useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    if (status !== "authenticated") {
      setLoadingBookings(false);
      return;
    }

    async function loadBookings() {
      try {
        setBookingError("");

        const response = await fetch("/api/bookings/my");
        const data = await response.json();

        if (!response.ok) {
          setBookingError(data.message || "Failed to load bookings.");
          return;
        }

        setBookings(data.bookings || []);
      } catch (error) {
        console.error("LOAD DASHBOARD BOOKINGS ERROR:", error);
        setBookingError("Failed to load bookings.");
      } finally {
        setLoadingBookings(false);
      }
    }

    loadBookings();
  }, [status]);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading dashboard...</p>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Please sign in
          </h1>

          <p className="mt-2 text-gray-500">
            You need to be signed in to access your dashboard.
          </p>

          <Link
            href="/auth/signin"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  const userName = session.user.name || "Guest";

  const now = new Date();

  const upcomingBookings = bookings.filter(
    (booking) =>
      booking.status !== "cancelled" &&
      new Date(booking.checkOut) >= now,
  );

  const pastBookings = bookings.filter(
    (booking) => new Date(booking.checkOut) < now,
  );

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed",
  );

  const nextBooking = upcomingBookings
    .filter((booking) => new Date(booking.checkIn) >= now)
    .sort(
      (a, b) =>
        new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime(),
    )[0];

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatCurrency(amount: number) {
    return `₦${amount.toLocaleString("en-NG")}`;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div>
          <p className="text-sm font-medium text-blue-600">
            GUEST DASHBOARD
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Welcome back, {userName}
          </h1>

          <p className="mt-3 text-gray-600">
            Manage your bookings, favorites, and account from here.
          </p>
        </div>

        {bookingError && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {bookingError}
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardStat
            icon="ri-calendar-check-line"
            iconStyle="bg-blue-50 text-blue-600"
            label="Total Bookings"
            value={loadingBookings ? "..." : bookings.length.toString()}
          />

          <DashboardStat
            icon="ri-home-heart-line"
            iconStyle="bg-green-50 text-green-600"
            label="Upcoming Stays"
            value={
              loadingBookings ? "..." : upcomingBookings.length.toString()
            }
          />

          <DashboardStat
            icon="ri-checkbox-circle-line"
            iconStyle="bg-purple-50 text-purple-600"
            label="Confirmed"
            value={
              loadingBookings ? "..." : confirmedBookings.length.toString()
            }
          />

          <DashboardStat
            icon="ri-history-line"
            iconStyle="bg-gray-100 text-gray-600"
            label="Past Stays"
            value={loadingBookings ? "..." : pastBookings.length.toString()}
          />
        </div>

        {!loadingBookings && nextBooking && (
          <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  NEXT STAY
                </p>

                <h2 className="mt-2 text-xl font-semibold text-gray-900">
                  {nextBooking.apartmentId?.title || "Shortlet Apartment"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {nextBooking.apartmentId?.location
                    ? `${nextBooking.apartmentId.location}, ${nextBooking.apartmentId.city}`
                    : "Apartment details unavailable"}
                </p>
              </div>

              <div className="sm:text-right">
                <p className="text-sm text-gray-500">Check-in</p>

                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {formatDate(nextBooking.checkIn)}
                </p>

                <Link
                  href="/dashboard/guest/bookings"
                  className="mt-3 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View booking
                  <i className="ri-arrow-right-line ml-1"></i>
                </Link>
              </div>
            </div>
          </section>
        )}

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            href="/dashboard/guest/favorites"
            icon="ri-heart-line"
            iconStyle="bg-red-50 text-red-500"
            title="Favorites"
            description="View the shortlet apartments you have saved."
            action="View Favorites"
          />

          <DashboardCard
            href="/dashboard/guest/bookings"
            icon="ri-calendar-check-line"
            iconStyle="bg-blue-50 text-blue-600"
            title="My Bookings"
            description="View and manage your shortlet bookings."
            action="View Bookings"
          />

          <DashboardCard
            href="/dashboard/guest/bookings?status=upcoming"
            icon="ri-home-heart-line"
            iconStyle="bg-green-50 text-green-600"
            title="Upcoming Stays"
            description="Keep track of your confirmed upcoming stays."
            action="View Stays"
          />

          <DashboardCard
            href="/dashboard/guest/bookings?status=past"
            icon="ri-history-line"
            iconStyle="bg-gray-100 text-gray-600"
            title="Past Bookings"
            description="View your previous shortlet stays and bookings."
            action="View History"
          />

          <DashboardCard
            href="/dashboard/guest/settings"
            icon="ri-settings-3-line"
            iconStyle="bg-purple-50 text-purple-600"
            title="Account Settings"
            description="Manage your personal information and account."
            action="Manage Account"
          />
        </div>
      </section>
    </main>
  );
}

function DashboardStat({
  icon,
  iconStyle,
  label,
  value,
}: {
  icon: string;
  iconStyle: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconStyle}`}
      >
        <i className={`${icon} text-xl`}></i>
      </div>

      <p className="mt-5 text-sm text-gray-500">{label}</p>

      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function DashboardCard({
  href,
  icon,
  iconStyle,
  title,
  description,
  action,
}: {
  href: string;
  icon: string;
  iconStyle: string;
  title: string;
  description: string;
  action: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-md"
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconStyle}`}
      >
        <i className={`${icon} text-2xl`}></i>
      </div>

      <h2 className="mt-5 text-lg font-semibold text-gray-900">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>

      <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-blue-600">
        {action}
        <i className="ri-arrow-right-line transition group-hover:translate-x-1"></i>
      </span>
    </Link>
  );
}