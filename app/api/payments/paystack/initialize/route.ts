import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Booking from "@/models/Booking";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking ID is required.",
        },
        { status: 400 },
      );
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 },
      );
    }

    if (booking.paymentStatus === "paid") {
      return NextResponse.json(
        {
          success: false,
          message: "This booking has already been paid.",
        },
        { status: 400 },
      );
    }

    if (
      booking.status === "pending" &&
      booking.expiresAt &&
      booking.expiresAt.getTime() < Date.now()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "This booking has expired. Please create a new booking.",
        },
        { status: 400 },
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Paystack is not configured.",
        },
        { status: 500 },
      );
    }

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: booking.guestEmail,
          amount: Math.round(booking.totalAmount * 100),
          reference: `ALLAPTS-${booking._id.toString()}-${Date.now()}`,
          callback_url: `${process.env.NEXTAUTH_URL}/payment/success`,
          metadata: {
            bookingId: booking._id.toString(),
          },
        }),
      },
    );

    const data = await response.json();
    console.log("========== PAYSTACK INITIALIZE ==========");
    console.log("PAYSTACK RESPONSE STATUS:", data.status);
    console.log("PAYSTACK RESPONSE MESSAGE:", data.message);
    console.log("PAYSTACK REFERENCE:", data.data?.reference);
    console.log("PAYSTACK ACCESS CODE:", data.data?.access_code);
    console.log("========================================");

    if (!response.ok || !data.status) {
      console.error("PAYSTACK INITIALIZE ERROR:", data);

      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to initialize Paystack payment.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      reference: data.data.reference,
    });
  } catch (error) {
    console.error("PAYSTACK INITIALIZE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to initialize payment.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
