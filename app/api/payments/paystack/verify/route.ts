import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Booking from "@/models/Booking";
import Apartment from "@/models/Apartment";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { sendEmail } from "@/app/lib/email";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");
    const bookingIdFromUrl = searchParams.get("bookingId");

    if (!reference) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment reference is required.",
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
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(
        reference,
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      console.error("PAYSTACK VERIFY ERROR:", data);

      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to verify payment.",
        },
        { status: 500 },
      );
    }

    const transaction = data.data;
    console.log("PAYSTACK VERIFIED REFERENCE:", transaction.reference);
    console.log("PAYSTACK TRANSACTION STATUS:", transaction.status);
    console.log("PAYSTACK TRANSACTION AMOUNT:", transaction.amount);
    console.log("PAYSTACK METADATA:", transaction.metadata);

    if (transaction.status !== "success") {
      return NextResponse.json(
        {
          success: false,
          message: "Payment was not successful.",
        },
        { status: 400 },
      );
    }

    const bookingId = transaction.metadata?.bookingId || bookingIdFromUrl;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: "Booking information was not found." },
        { status: 400 },
      );
    }

    const booking = await Booking.findById(bookingId);
    console.log("BOOKING ID FROM PAYMENT:", bookingId);
    console.log("BOOKING FOUND:", !!booking);
    console.log("BOOKING PAYMENT STATUS:", booking?.paymentStatus);
    console.log("BOOKING TOTAL AMOUNT:", booking?.totalAmount);

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 },
      );
    }

    const expectedAmount = Math.round(booking.totalAmount * 100);

    if (Number(transaction.amount) !== expectedAmount) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment amount does not match the booking.",
        },
        { status: 400 },
      );
    }

    if (booking.paymentStatus !== "paid") {
      booking.paymentStatus = "paid";
      booking.paymentReference = reference;
      booking.paidAt = new Date();
      booking.expiresAt = undefined;

      await booking.save();

      const apartment = await Apartment.findById(booking.apartmentId).select(
        "ownerId title",
      );

      const owner = apartment?.ownerId
        ? await User.findById(apartment.ownerId).select("name email")
        : null;

      console.log("APARTMENT FOUND FOR NOTIFICATION:", !!apartment);
      console.log("APARTMENT OWNER ID:", apartment?.ownerId);
      console.log("OWNER FOUND FOR EMAIL:", !!owner);
      console.log("OWNER EMAIL:", owner?.email);

      if (apartment?.ownerId) {
        await Notification.create({
          userId: apartment.ownerId,
          type: "payment",
          title: "Payment received",
          message: `Payment of ₦${booking.totalAmount.toLocaleString()} has been received for ${apartment.title}. The payment will reflect on your dashboard 12 hours after the guest checks in.`,
          isRead: false,
          link: "/dashboard/owner/bookings",
        });

        if (owner?.email) {
          await sendEmail({
            to: owner.email,
            subject: "Payment received - Action required",
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Payment Received</h2>

          <p>Hello ${owner.name || "Owner"},</p>

          <p>
            A guest has successfully made a payment for your shortlet apartment.
          </p>

          <p>
            <strong>Apartment:</strong> ${apartment.title}<br />
            <strong>Amount:</strong> ₦${booking.totalAmount.toLocaleString()}<br />
            <strong>Guest:</strong> ${booking.guestName}<br />
            <strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString("en-NG")}<br />
            <strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString("en-NG")}
          </p>

          <p>
            Please log in to your All-Apts owner dashboard and confirm this booking.
          </p>

          <p>
            The payment will reflect on your dashboard 12 hours after the guest checks in.
          </p>

          <p>
            Thank you,<br />
            All-Apts
          </p>
        </div>
      `,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully.",
      bookingId: booking._id.toString(),
      paymentReference: reference,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.status,
    });
  } catch (error) {
    console.error("PAYSTACK VERIFY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify payment.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
