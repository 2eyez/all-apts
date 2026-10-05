import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/app/lib/mongodb";
import Apartment from "@/models/Apartment";
import { authOptions } from "@/auth";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope");

    if (scope === "owner") {
      const session = await getServerSession(authOptions);

      if (!session?.user) {
        return NextResponse.json(
          {
            success: false,
            message: "You must be signed in to view owner apartments",
          },
          { status: 401 },
        );
      }

      if (
        session.user.role !== "owner" &&
        session.user.role !== "admin"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "You are not authorized to view owner apartments",
          },
          { status: 403 },
        );
      }

      const filter =
        session.user.role === "owner"
          ? { ownerId: session.user.id }
          : {};

      const apartments = await Apartment.find(filter).sort({
        createdAt: -1,
      });

      return NextResponse.json({
        success: true,
        apartments,
      });
    }

    // Public apartment listings
    const apartments = await Apartment.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      apartments,
    });
  } catch (error) {
    console.error("FETCH APARTMENTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch apartments",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in to create an apartment",
        },
        { status: 401 },
      );
    }

    if (session.user.role !== "owner" && session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to create an apartment",
        },
        { status: 403 },
      );
    }

    await connectDB();

    const body = await request.json();

    const apartment = await Apartment.create({
      title: body.title,
      description: body.description,
      address: body.address,
      location: body.location,
      city: body.city,
      price: Number(body.price),
      discount: Number(body.discount) || 0,
      bedrooms: Number(body.bedrooms),
      bathrooms: Number(body.bathrooms),
      images: Array.isArray(body.images) ? body.images : [],
      amenities: Array.isArray(body.amenities) ? body.amenities : [],
      rules: Array.isArray(body.rules) ? body.rules : [],
      rating: 0,
      ownerId: session.user.id,
      listedBy:
        session.user.companyName ||
        session.user.name ||
        "All-Apts",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Apartment listed successfully",
        apartment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE APARTMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create apartment",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}