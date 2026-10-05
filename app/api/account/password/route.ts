import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/auth";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
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
    const currentPassword = String(body.currentPassword ?? "");

    if (!currentPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password is required",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect password",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password verified",
    });
  } catch (error) {
    console.error("VERIFY PASSWORD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify password",
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

    const currentPassword = String(body.currentPassword ?? "");
    const newPassword = String(body.newPassword ?? "");

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password and new password are required",
        },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be at least 8 characters",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect password",
        },
        { status: 400 },
      );
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = newHashedPassword;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to change password",
      },
      { status: 500 },
    );
  }
}