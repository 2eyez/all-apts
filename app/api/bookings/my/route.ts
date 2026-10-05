
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectDB } from "@/app/lib/mongodb";
import Booking from "@/models/Booking";

export async function GET() {
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

    await connectDB();

    const bookings = await Booking.find({
      userId: session.user.id,
    })
      .populate("apartmentId")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("FETCH MY BOOKINGS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch bookings.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

