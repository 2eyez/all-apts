"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const bookingId = searchParams.get("bookingId");

  console.log("PAYSTACK CALLBACK REFERENCE:", reference);
  console.log("BOOKING ID:", bookingId);

  const [status, setStatus] = useState("Verifying your payment...");

  useEffect(() => {
    if (!reference) {
      setStatus("Payment reference was not found.");
      return;
    }

    const paymentReference = reference;
    const verificationKey = `all-apts-payment-verified-${paymentReference}`;

    if (sessionStorage.getItem(verificationKey)) {
      return;
    }

    sessionStorage.setItem(verificationKey, "true");

    async function verifyPayment() {
      try {
        const response = await fetch(
          `/api/payments/paystack/verify?reference=${encodeURIComponent(
            paymentReference,
          )}&bookingId=${encodeURIComponent(bookingId || "")}`,
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          sessionStorage.removeItem(verificationKey);
          setStatus(data.message || "We could not verify your payment.");
          return;
        }

        setStatus(
          "Payment successful! Your booking is now pending owner confirmation.",
        );

        setTimeout(() => {
          window.location.href = "/";
        }, 50000);
      } catch (error) {
        console.error("PAYMENT VERIFICATION ERROR:", error);
        sessionStorage.removeItem(verificationKey);
        setStatus(
          "We could not verify your payment. Please contact All-Apts support.",
        );
      }
    }

    verifyPayment();
  }, [reference, bookingId]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <i className="ri-check-line text-3xl text-green-600" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-gray-950">
          Booking Payment
        </h1>

        <p className="mt-3 text-gray-600">{status}</p>

        {reference && (
          <p className="mt-4 text-sm text-gray-400">Reference: {reference}</p>
        )}
      </div>
    </main>
  );
}
