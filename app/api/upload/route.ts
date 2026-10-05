import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import cloudinary from "@/app/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in to upload images",
        },
        { status: 401 },
      );
    }

    if (session.user.role !== "owner" && session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to upload images",
        },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "No image file was provided",
        },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "all-apts/apartments",
              resource_type: "image",
            },
            (error, result) => {
              if (error) {
                reject(error);
                return;
              }

              if (!result?.secure_url) {
                reject(new Error("Cloudinary did not return an image URL"));
                return;
              }

              resolve({
                secure_url: result.secure_url,
              });
            },
          )
          .end(buffer);
      },
    );

    return NextResponse.json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    console.error("IMAGE UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload image",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}