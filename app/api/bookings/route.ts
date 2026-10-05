import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectDB } from "@/app/lib/mongodb";
import Booking from "@/models/Booking";
import Apartment from "@/models/Apartment";

export async function GET(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(request.url);

    const apartmentId = searchParams.get("apartmentId");

    const ownerScope = searchParams.get("scope") === "owner";

    if (ownerScope) {
      if (!session?.user) {
        return NextResponse.json(
          {
            success: false,
            message: "You must be signed in to view owner bookings.",
          },
          { status: 401 },
        );
      }

      if (session.user.role !== "owner" && session.user.role !== "admin") {
        return NextResponse.json(
          {
            success: false,
            message: "You are not authorized to view owner bookings.",
          },
          { status: 403 },
        );
      }

      const apartments =
        session.user.role === "owner"
          ? await Apartment.find({
              ownerId: session.user.id,
            }).select("_id")
          : await Apartment.find().select("_id");

      const apartmentIds = apartments.map((apartment) => apartment._id);

      const bookings = await Booking.find({
        apartmentId: { $in: apartmentIds },
      })
        .populate("apartmentId", "title city location images")
        .sort({ createdAt: -1 });

      return NextResponse.json({
        success: true,
        bookings,
      });
    }

    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    if (!apartmentId || !checkIn || !checkOut) {
      return NextResponse.json(
        {
          success: false,
          message: "Apartment ID, check-in and check-out are required.",
        },
        { status: 400 },
      );
    }

    const [checkInYear, checkInMonth, checkInDay] = checkIn
      .split("-")
      .map(Number);

    const [checkOutYear, checkOutMonth, checkOutDay] = checkOut
      .split("-")
      .map(Number);

    const requestedCheckIn = new Date(
      Date.UTC(checkInYear, checkInMonth - 1, checkInDay),
    );

    const requestedCheckOut = new Date(
      Date.UTC(checkOutYear, checkOutMonth - 1, checkOutDay),
    );

    if (requestedCheckOut <= requestedCheckIn) {
      return NextResponse.json(
        {
          success: false,
          message: "Check-out date must be after check-in date.",
        },
        { status: 400 },
      );
    }

    const now = new Date();

    const bookings = await Booking.find({
      apartmentId,
      $or: [
        {
          status: "confirmed",
        },
        {
          status: "pending",
          expiresAt: { $gt: now },
        },
      ],
      checkIn: { $lt: requestedCheckOut },
      checkOut: { $gt: requestedCheckIn },
    }).sort({ checkIn: 1 });

    return NextResponse.json({
      success: true,
      available: bookings.length === 0,
      bookings,
    });
  } catch (error) {
    console.error("CHECK AVAILABILITY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to check apartment availability.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    const body = await request.json();

    const {
      apartmentId,
      checkIn,
      checkOut,
      guests,
      guestName,
      guestEmail,
      guestPhone,
    } = body;

    if (
      !apartmentId ||
      !checkIn ||
      !checkOut ||
      !guests ||
      !guestName ||
      !guestEmail ||
      !guestPhone
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Apartment ID, check-in, check-out, guests, name, email and phone are required.",
        },
        { status: 400 },
      );
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      String(guestEmail).trim(),
    );

    const phoneIsValid = /^[0-9+()\-\s]{7,20}$/.test(String(guestPhone).trim());

    if (!emailIsValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 },
      );
    }

    if (!phoneIsValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid phone number.",
        },
        { status: 400 },
      );
    }

    const apartment = await Apartment.findById(apartmentId);

    if (!apartment) {
      return NextResponse.json(
        {
          success: false,
          message: "Apartment not found.",
        },
        { status: 404 },
      );
    }

    const [checkInYear, checkInMonth, checkInDay] = checkIn
      .split("-")
      .map(Number);

    const [checkOutYear, checkOutMonth, checkOutDay] = checkOut
      .split("-")
      .map(Number);

    const requestedCheckIn = new Date(
      Date.UTC(checkInYear, checkInMonth - 1, checkInDay),
    );

    const requestedCheckOut = new Date(
      Date.UTC(checkOutYear, checkOutMonth - 1, checkOutDay),
    );

    if (requestedCheckOut <= requestedCheckIn) {
      return NextResponse.json(
        {
          success: false,
          message: "Check-out date must be after check-in date.",
        },
        { status: 400 },
      );
    }

    const guestCount = Number(guests);
    const maxGuests = apartment.bedrooms * 2;

    if (guestCount < 1 || guestCount > maxGuests) {
      return NextResponse.json(
        {
          success: false,
          message: `This apartment allows a maximum of ${maxGuests} guests.`,
        },
        { status: 400 },
      );
    }

    const difference = requestedCheckOut.getTime() - requestedCheckIn.getTime();

    const nights = Math.ceil(difference / (1000 * 60 * 60 * 24));

    const discount = Number(apartment.discount) || 0;

    const pricePerNight = Math.round(apartment.price * (1 - discount / 100));

    const totalAmount = nights * pricePerNight;

    const now = new Date();

    const existingBooking = await Booking.findOne({
      apartmentId,
      $or: [
        {
          status: "confirmed",
        },
        {
          status: "pending",
          expiresAt: { $gt: now },
        },
      ],
      checkIn: { $lt: requestedCheckOut },
      checkOut: { $gt: requestedCheckIn },
    });

    if (existingBooking) {
      return NextResponse.json(
        {
          success: false,
          message: "This apartment is no longer available for those dates.",
        },
        { status: 409 },
      );
    }

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const bookingData: {
      apartmentId: string;
      checkIn: Date;
      checkOut: Date;
      nights: number;
      guests: number;
      pricePerNight: number;
      totalAmount: number;
      status: "pending";
      paymentStatus: "unpaid";
      expiresAt: Date;
      guestName: string;
      guestEmail: string;
      guestPhone: string;
      userId?: string;
    } = { 
      apartmentId,
      checkIn: requestedCheckIn,
      checkOut: requestedCheckOut,
      nights,
      guests: guestCount,
      pricePerNight,
      totalAmount,
      status: "pending",
      paymentStatus: "unpaid",
      expiresAt,
      guestName: String(guestName).trim(),
      guestEmail: String(guestEmail).trim().toLowerCase(),
      guestPhone: String(guestPhone).trim(),
    };

    // Registered guests are linked to their authenticated account.
    // Guests without accounts simply won't have a userId.
    if (session?.user?.id) {
      bookingData.userId = session.user.id;
    }

    const booking = await Booking.create(bookingData);

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully.",
        booking,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create booking.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
