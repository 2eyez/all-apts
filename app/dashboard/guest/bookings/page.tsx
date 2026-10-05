"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Apartment {
  _id: string;
  title: string;
  location: string;
  city: string;
  images: string[];
}

interface Booking {
  _id: string;
  apartmentId: Apartment;
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

function BookingsContent() {
  const { data: session, status: sessionStatus } = useSession();
  const searchParams = useSearchParams();

  const bookingStatus = searchParams.get("status");

  const isUpcoming = bookingStatus === "upcoming";
  const isPast = bookingStatus === "past";

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBookings() {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/bookings/my");

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch bookings.");
        }

        setBookings(data.bookings || []);
      } catch (error) {
        console.error("FETCH BOOKINGS ERROR:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load your bookings.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [session]);

  if (sessionStatus === "loading" || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading bookings...</p>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please sign in</h1>

          <p className="mt-2 text-gray-500">
            You need to be signed in to view your bookings.
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

  const now = new Date();

  const filteredBookings = bookings.filter((booking) => {
    const checkOut = new Date(booking.checkOut);

    if (isUpcoming) {
      return checkOut >= now && booking.status === "confirmed";
    }

    if (isPast) {
      return checkOut < now;
    }

    return true;
  });

  let pageTitle = "My Bookings";
  let pageDescription = "View and manage all your shortlet bookings.";

  if (isUpcoming) {
    pageTitle = "Upcoming Stays";
    pageDescription = "View your confirmed upcoming shortlet stays.";
  }

  if (isPast) {
    pageTitle = "Past Bookings";
    pageDescription = "View your previous shortlet stays and bookings.";
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div>
          <p className="text-sm font-medium text-blue-600">GUEST DASHBOARD</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            {pageTitle}
          </h1>

          <p className="mt-3 text-gray-600">{pageDescription}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/dashboard/guest/bookings"
            className={`rounded-xl px-5 py-3 text-sm font-medium transition ${
              !bookingStatus
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
            }`}
          >
            All Bookings
          </Link>

          <Link
            href="/dashboard/guest/bookings?status=upcoming"
            className={`rounded-xl px-5 py-3 text-sm font-medium transition ${
              isUpcoming
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
            }`}
          >
            Upcoming Stays
          </Link>

          <Link
            href="/dashboard/guest/bookings?status=past"
            className={`rounded-xl px-5 py-3 text-sm font-medium transition ${
              isPast
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
            }`}
          >
            Past Bookings
          </Link>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {filteredBookings.length === 0 && !error ? (
          <div className="mt-8 rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-gray-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <i className="ri-calendar-check-line text-3xl"></i>
            </div>

            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              {isUpcoming
                ? "No upcoming stays"
                : isPast
                  ? "No past bookings"
                  : "No bookings yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              {isUpcoming
                ? "Your upcoming confirmed stays will appear here."
                : isPast
                  ? "Your previous stays will appear here."
                  : "Your shortlet bookings will appear here once you make a reservation."}
            </p>

            <Link
              href="/apartments"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Find a Shortlet
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="h-56 w-full md:h-auto md:w-72">
                    <img
                      src={booking.apartmentId?.images?.[0] || "/hero.jpeg"}
                      alt={booking.apartmentId?.title || "Shortlet apartment"}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                          {booking.status}
                        </p>

                        <h2 className="mt-2 text-xl font-semibold text-gray-900">
                          {booking.apartmentId?.title || "Shortlet Apartment"}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          {booking.apartmentId?.location},{" "}
                          {booking.apartmentId?.city}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-400">Total</p>

                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          ₦{booking.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-4">
                      <div>
                        <p className="text-xs text-gray-400">Check-in</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {new Date(booking.checkIn).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Check-out</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Nights</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {booking.nights}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Guests</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {booking.guests}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      {booking.apartmentId?._id && (
                        <Link
                          href={`/apartments/${booking.apartmentId._id}`}
                          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                          View Apartment
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function BookingsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-50">
          <p className="text-gray-500">Loading bookings...</p>
        </main>
      }
    >
      <BookingsContent />
    </Suspense>
  );
}
