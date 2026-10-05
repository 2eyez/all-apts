"use client";

import { useEffect, useState } from "react";

interface Apartment {
  _id: string;
  title: string;
  city: string;
  location: string;
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
  paymentStatus: "unpaid" | "paid" | "failed";
  createdAt: string;
}

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(
    null,
  );

  async function updateBookingStatus(
    bookingId: string,
    status: "confirmed" | "cancelled",
  ) {
    try {
      setUpdatingBookingId(bookingId);
      setError("");

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update booking.");
      }

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status,
              }
            : booking,
        ),
      );

      window.dispatchEvent(new Event("owner-bookings-updated"));
    } catch (error) {
      console.error("UPDATE BOOKING ERROR:", error);

      setError(
        error instanceof Error ? error.message : "Failed to update booking.",
      );
    } finally {
      setUpdatingBookingId(null);
    }
  }

useEffect(() => {
  async function loadBookings() {
    try {
      const response = await fetch("/api/bookings?scope=owner");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load bookings.");
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error("OWNER BOOKINGS ERROR:", error);

      setError(
        error instanceof Error ? error.message : "Failed to load bookings.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  loadBookings();

  function handleBookingsUpdated() {
    loadBookings();
  }

  window.addEventListener(
    "owner-bookings-updated",
    handleBookingsUpdated,
  );

  return () => {
    window.removeEventListener(
      "owner-bookings-updated",
      handleBookingsUpdated,
    );
  };
}, []);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Booking Management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 md:text-3xl">
            Bookings
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage reservations, guest stays, payments, and booking status for
            your apartments.
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex min-h-[260px] items-center justify-center">
              <p className="text-sm text-gray-500">Loading bookings...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                <i className="ri-calendar-check-line text-3xl text-blue-600" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-gray-950">
                No bookings yet
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                Your apartment reservations will appear here once guests start
                making bookings.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Guest
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Apartment
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Stay
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Guests
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold text-gray-950">
                          {booking.guestName}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {booking.guestEmail}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {booking.guestPhone}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-medium text-gray-950">
                          {booking.apartmentId?.title || "Apartment"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {booking.apartmentId?.location ||
                            booking.apartmentId?.city ||
                            ""}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-gray-950">
                          {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {booking.nights}{" "}
                          {booking.nights === 1 ? "night" : "nights"}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-700">
                        {booking.guests}
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-semibold text-gray-950">
                          ₦{booking.totalAmount.toLocaleString()}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          ₦{booking.pricePerNight.toLocaleString()}
                          /night
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            booking.paymentStatus === "paid"
                              ? "bg-green-50 text-green-700"
                              : booking.paymentStatus === "failed"
                                ? "bg-red-50 text-red-700"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-col items-start gap-3">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                              booking.status === "confirmed"
                                ? "bg-green-50 text-green-700"
                                : booking.status === "cancelled"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-yellow-50 text-yellow-700"
                            }`}
                          >
                            {booking.status}
                          </span>

                          {booking.status === "pending" && (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  updateBookingStatus(booking._id, "confirmed")
                                }
                                disabled={updatingBookingId === booking._id}
                                className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {updatingBookingId === booking._id
                                  ? "Updating..."
                                  : "Confirm"}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  updateBookingStatus(booking._id, "cancelled")
                                }
                                disabled={updatingBookingId === booking._id}
                                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {updatingBookingId === booking._id
                                  ? "Updating..."
                                  : "Cancel"}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
