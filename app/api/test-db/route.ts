import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      message: "MongoDB connected successfully",
    });
  } catch (error) {
    console.error("DATABASE CONNECTION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "MongoDB connection failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}