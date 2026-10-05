"use client";

import { useEffect, useMemo, useState } from "react";
import Paystack from "@paystack/inline-js";

interface BookingWidgetProps {
  apartmentId: string;
  price: number;
  discount: number;
  maxGuests: number;
}

export default function BookingWidget({
  apartmentId,
  price,
  discount,
  maxGuests,
}: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail.trim());

  const phoneIsValid = /^[0-9+()\-\s]{7,20}$/.test(guestPhone.trim());

  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [availabilityError, setAvailabilityError] = useState("");
  const [booking, setBooking] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const difference = end.getTime() - start.getTime();

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  const discountedPrice = Math.round(price * (1 - discount / 100));

  const total = nights > 0 ? nights * discountedPrice : 0;

  useEffect(() => {
    async function checkAvailability() {
      if (!checkIn || !checkOut || nights <= 0) {
        setAvailable(null);
        setAvailabilityError("");
        return;
      }

      setCheckingAvailability(true);
      setAvailable(null);
      setAvailabilityError("");

      try {
        const response = await fetch(
          `/api/bookings?apartmentId=${apartmentId}&checkIn=${checkIn}&checkOut=${checkOut}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to check availability.");
        }

        setAvailable(data.available);
      } catch (error) {
        console.error("AVAILABILITY CHECK ERROR:", error);

        setAvailable(null);
        setAvailabilityError(
          error instanceof Error
            ? error.message
            : "Failed to check availability.",
        );
      } finally {
        setCheckingAvailability(false);
      }
    }

    checkAvailability();
  }, [apartmentId, checkIn, checkOut, nights]);

  return (
    <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">Book this shortlet</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Check-in
          </label>

          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => {
              setCheckIn(e.target.value);
              setAvailable(null);
            }}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Check-out
          </label>

          <input
            type="date"
            value={checkOut}
            min={checkIn || today}
            onChange={(e) => {
              setCheckOut(e.target.value);
              setAvailable(null);
            }}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Guests
        </label>

        <input
          type="number"
          min="1"
          max={maxGuests}
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600"
        />

        <p className="mt-1 text-xs text-gray-500">Maximum {maxGuests} guests</p>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Guest information
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          You can book without creating an All-Apts account.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Full name
            </label>

            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email address
            </label>

            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-blue-600 ${
                guestEmail && !emailIsValid
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
            />

            {guestEmail && !emailIsValid && (
              <p className="mt-1 text-xs text-red-500">
                Please enter a valid email address.
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Phone number
            </label>

            <input
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="Enter your phone number"
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-blue-600 ${
                guestPhone && !phoneIsValid
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
            />

            {guestPhone && !phoneIsValid && (
              <p className="mt-1 text-xs text-red-500">
                Please enter a valid phone number.
              </p>
            )}
          </div>
        </div>
      </div>

      {nights > 0 && (
        <div className="mt-6 rounded-xl bg-gray-50 p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {discount > 0 && (
                <span className="mr-2 text-gray-400 line-through">
                  ₦{price.toLocaleString()}
                </span>
              )}
              ₦{discountedPrice.toLocaleString()} × {nights}{" "}
              {nights === 1 ? "night" : "nights"}
            </span>

            <span>₦{total.toLocaleString()}</span>
          </div>

          <div className="mt-3 border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Total</span>

              <span className="text-xl font-bold text-gray-900">
                ₦{total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {checkingAvailability && (
        <p className="mt-4 text-sm text-gray-500">Checking availability...</p>
      )}

      {!checkingAvailability && available === true && (
        <p className="mt-4 text-sm font-medium text-green-600">
          This apartment is available for your selected dates.
        </p>
      )}

      {!checkingAvailability && available === false && (
        <p className="mt-4 text-sm font-medium text-red-600">
          This apartment is not available for your selected dates.
        </p>
      )}

      {availabilityError && (
        <p className="mt-4 text-sm font-medium text-red-600">
          {availabilityError}
        </p>
      )}

      <button
        type="button"
        disabled={
          !checkIn ||
          !checkOut ||
          nights <= 0 ||
          checkingAvailability ||
          available !== true ||
          !guestName.trim() ||
          !emailIsValid ||
          !phoneIsValid ||
          booking
        }
        className="mt-6 w-full rounded-xl bg-black px-6 py-4 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"

        onClick={async () => {
          if (available !== true || booking) return;

          if (Number(guests) > maxGuests) {
            alert(`This apartment allows a maximum of ${maxGuests} guests.`);
            return;
          }

          if (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
            alert("Please enter your name, email and phone number.");
            return;
          }

          setBooking(true);

          try {
            const bookingResponse = await fetch("/api/bookings", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                apartmentId,
                checkIn,
                checkOut,
                guests: Number(guests),
                guestName: guestName.trim(),
                guestEmail: guestEmail.trim(),
                guestPhone: guestPhone.trim(),
              }),
            });

            const bookingData = await bookingResponse.json();

            if (!bookingResponse.ok || !bookingData.success) {
              alert(bookingData.message || "Failed to create booking.");
              return;
            }

            const bookingId = bookingData.booking._id;

            const paymentResponse = await fetch(
              "/api/payments/paystack/initialize",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  bookingId,
                }),
              },
            );

            const paymentData = await paymentResponse.json();

            if (!paymentResponse.ok || !paymentData.success) {
              alert(paymentData.message || "Failed to initialize payment.");
              return;
            }

            const paystack = new Paystack();

            paystack.resumeTransaction(paymentData.accessCode, {
              onSuccess: (transaction: { reference: string }) => {
                window.location.href = `/payment/success?reference=${encodeURIComponent(
                  transaction.reference,
                )}&bookingId=${encodeURIComponent(bookingId)}`;
              },
            });
            
          } catch (error) {
            console.error("BOOKING PAYMENT ERROR:", error);

            alert("Something went wrong while starting your payment.");
          } finally {
            setBooking(false);
          }
        }}
      >
        {booking ? "Creating booking..." : "Continue to Booking"}
      </button>
    </div>
  );
}
