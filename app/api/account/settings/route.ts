import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id).select(
      "name email phone role companyName",
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET ACCOUNT SETTINGS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load account settings",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name is required",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        name,
        phone,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("name email phone role companyName");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Account updated successfully",
      user,
    });
  } catch (error) {
    console.error("UPDATE ACCOUNT SETTINGS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update account settings",
      },
      { status: 500 },
    );
  }
}