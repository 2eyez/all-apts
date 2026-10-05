import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/models/User";
import Apartment from "@/models/Apartment";

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

    const user = await User.findById(session.user.id).populate(
      "favoriteApartments",
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      favorites: user.favoriteApartments,
    });
  } catch (error) {
    console.error("FETCH FAVORITES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch favorites.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();
    const apartmentId = String(body.apartmentId || "").trim();

    if (!apartmentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Apartment ID is required.",
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

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 },
      );
    }

    const alreadyFavorite = user.favoriteApartments.some(
      (favoriteId) => favoriteId.toString() === apartmentId,
    );

    if (!alreadyFavorite) {
      user.favoriteApartments.push(apartment._id);
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: alreadyFavorite
        ? "Apartment is already in favorites."
        : "Apartment added to favorites.",
      favorites: user.favoriteApartments,
    });
  } catch (error) {
    console.error("ADD FAVORITE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add favorite.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
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

    const body = await request.json();
    const apartmentId = String(body.apartmentId || "").trim();

    if (!apartmentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Apartment ID is required.",
        },
        { status: 400 },
      );
    }

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 },
      );
    }

    user.favoriteApartments = user.favoriteApartments.filter(
      (favoriteId) => favoriteId.toString() !== apartmentId,
    );

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Apartment removed from favorites.",
      favorites: user.favoriteApartments,
    });
  } catch (error) {
    console.error("REMOVE FAVORITE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove favorite.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}