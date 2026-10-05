import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import { connectDB } from "@/app/lib/mongodb";
import Apartment from "@/models/Apartment";
import { authOptions } from "@/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in.",
        },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid apartment ID.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const apartment = await Apartment.findById(id);

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
      session.user.role !== "admin" &&
      apartment.ownerId.toString() !== session.user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to view this apartment.",
        },
        { status: 403 },
      );
    }

    return NextResponse.json({
      success: true,
      apartment,
    });
  } catch (error) {
    console.error("FETCH SINGLE APARTMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch apartment.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

//put request handler for updating apartment details
export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in.",
        },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid apartment ID.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const apartment = await Apartment.findById(id);

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
      session.user.role !== "admin" &&
      apartment.ownerId.toString() !== session.user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to update this apartment.",
        },
        { status: 403 },
      );
    }

    const body = await request.json();

    const price = Number(body.price);
    const discount = Number(body.discount);
    const images = Array.isArray(body.images) ? body.images : apartment.images;

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid price.",
        },
        { status: 400 },
      );
    }

    if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Discount must be between 0% and 100%.",
        },
        { status: 400 },
      );
    }

    apartment.price = price;
    apartment.discount = discount;
    apartment.images = images;

    await apartment.save();

    return NextResponse.json({
      success: true,
      message: "Apartment updated successfully.",
      apartment,
    });
  } catch (error) {
    console.error("UPDATE APARTMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update apartment.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
