import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectDB } from "@/app/lib/mongodb";
import Notification from "@/models/Notification";

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

    const notifications = await Notification.find({
      userId: session.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const unreadCount = await Notification.countDocuments({
      userId: session.user.id,
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("NOTIFICATIONS GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load notifications",
      },
      { status: 500 },
    );
  }
}

export async function PATCH() {
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

    await Notification.updateMany(
      {
        userId: session.user.id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      },
    );

    return NextResponse.json({
      success: true,
      message: "Notifications marked as read",
    });
  } catch (error) {
    console.error("NOTIFICATIONS PATCH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to mark notifications as read",
      },
      { status: 500 },
    );
  }
}