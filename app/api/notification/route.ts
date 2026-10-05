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
        { success: false, message: "Unauthorized" },
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

    await connectDB();

    const body = await request.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json(
        {
          success: false,
          message: "Notification ID is required",
        },
        { status: 400 },
      );
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        userId: session.user.id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      },
      {
        new: true,
      },
    );

    if (!notification) {
      return NextResponse.json(
        {
          success: false,
          message: "Notification not found or already read",
        },
        { status: 404 },
      );
    }

    const unreadCount = await Notification.countDocuments({
      userId: session.user.id,
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      message: "Notification marked as read",
      notification,
      unreadCount,
    });
  } catch (error) {
    console.error("NOTIFICATIONS PATCH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to mark notification as read",
      },
      { status: 500 },
    );
  }
}