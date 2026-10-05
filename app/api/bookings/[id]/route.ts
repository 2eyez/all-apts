import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectDB } from "@/app/lib/mongodb";
import Booking from "@/models/Booking";
import Apartment from "@/models/Apartment";
import User from "@/models/User";
import { sendEmail } from "@/app/lib/email";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in.",
        },
        { status: 401 },
      );
    }

    if (session.user.role !== "owner" && session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to manage bookings.",
        },
        { status: 403 },
      );
    }

    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const { status } = body;

    if (!["confirmed", "cancelled"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid booking status.",
        },
        { status: 400 },
      );
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 },
      );
    }

    const apartment = await Apartment.findById(booking.apartmentId);

    const owner = apartment?.ownerId
      ? await User.findById(apartment.ownerId).select("name phone")
      : null;

    if (!apartment) {
      return NextResponse.json(
        {
          success: false,
          message: "Apartment not found.",
        },
        { status: 404 },
      );
    }

    if (
      session.user.role === "owner" &&
      apartment.ownerId.toString() !== session.user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to manage this booking.",
        },
        { status: 403 },
      );
    }

    if (status === "confirmed" && booking.paymentStatus !== "paid") {
      return NextResponse.json(
        {
          success: false,
          message: "This booking must be paid before it can be confirmed.",
        },
        { status: 400 },
      );
    }

    booking.status = status;

    if (status === "confirmed") {
      booking.expiresAt = undefined;
    }

    await booking.save();

    if (status === "confirmed" && booking.guestEmail) {
      await sendEmail({
        to: booking.guestEmail,
        subject: "Your All-Apts booking has been confirmed",
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #222; max-width: 650px; margin: 0 auto;">

        <h2 style="color: #071d3b;">
          Booking Confirmed
        </h2>

        <p>
          Hello ${booking.guestName},
        </p>

        <p>
          <strong>Your payment has been received and your booking has been confirmed.</strong>
        </p>

        <p>
          Your reservation is now ready. Please keep this email as your booking
          confirmation and receipt.
        </p>

        <hr />

        <h3 style="color: #071d3b;">
          Booking Receipt
        </h3>

        <p>
          <strong>Apartment:</strong> ${apartment.title}<br />
          <strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString("en-NG")}<br />
          <strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString("en-NG")}<br />
          <strong>Number of guests:</strong> ${booking.guests}<br />
          <strong>Number of nights:</strong> ${booking.nights}<br />
          <strong>Amount paid:</strong> ₦${booking.totalAmount.toLocaleString()}<br />
          <strong>Payment reference:</strong> ${booking.paymentReference || "N/A"}
        </p>

        <hr />

        <h3 style="color: #071d3b;">
          Contact the Owner
        </h3>

        <p>
          If you have any questions about the apartment, check-in instructions,
          directions, or your stay, you can contact the Apartment owner directly:
        </p>

        <p>
          <strong>Owner:</strong> ${owner?.name || "Apartment Owner"}<br />
          <strong>Phone:</strong> ${owner?.phone || "Phone number unavailable"}
        </p>

        <hr />

        <p>
          Thank you for booking with All Apartments online.
        </p>

        <p>
          We look forward to hosting you.
        </p>

        <p>
             <strong>All Apartments online Team</strong><br />
           <a href="mailto:info@allapartmentsonline.com">
            info@allapartmentsonline.com
           </a>
        </p>

      </div>
    `,
      });
    }

    return NextResponse.json({
      success: true,
      message:
        status === "confirmed"
          ? "Booking confirmed successfully."
          : "Booking cancelled successfully.",
      booking,
    });
  } catch (error) {
    console.error("UPDATE BOOKING ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update booking.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
